var controllerBuilder = require('../controllers/BaseControllerJobs');
var mongoose = require('mongoose');
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var startJob = require('../jobs/StartJob');
var Job = require('../models/CronJob').model;
var Log = require('../models/Logs').model;
var CronTime = require('cron').CronTime;

module.exports = function (app, models) {
    app.post("/runjob", function (req, res) {
        if (!req.body.JobId)
            return res.status(400).json({
                error: "Bad Request"
            });
        var query = {
            _id: req.body.JobId
        };
        Job.findOne(query, function (err, job) {
            if (err) {
                return res.status(404).json({
                    error: "Job not found"
                });
            } else {
                startJob(job, 'Now');
                res.status(200).json({
                    "message": "Job Started.Please check logs for status."
                });
            }
        })
    });
    app.post("/api/editjob", function (req, res) {
        if (!req.query._id)
            return res.status(400).json({
                error: "Bad Request"
            });
        var query = {
            _id: req.query._id
        };
        Job.findOne(query, function (err, job) {
            if (err) {
                return res.status(404).json({
                    error: "Job not found"
                });
            } else {
                for (var p in req.body) {
                    job[p] = req.body[p];
                }
                job.save(function (err) {
                    if (err)
                        return res.status(404).json({
                            error: err
                        });
                    startJob(job, 'Schedule');
                    res.status(200).json(job);
                })
            }
        })
    });
    app.get("/api/logRunTime/:startDt/:endDt", function (req, res) {
        if (!req.params.startDt || !req.params.endDt)
            res.status(400).json({
                error: "Bad Request"
            });
        var querystring = {
            RunTime: {
                "$gt": new Date(req.params.startDt),
                "$lt": new Date(req.params.endDt)
            }
        };
        Log.find(querystring, function (err, logs) {
            if (err) { } else {
                res.status(200).json(logs);
            }
        })
    });
    for (var key in models) {
        if (models.hasOwnProperty(key)) {
            var controller = controllerBuilder(models[key]);
            app.get('/api/' + key, controller.get);
            app.get('/api/' + key + '/:_id', controller.getById);
            app.post('/api/' + key, controller.post);
            app.post('/api/' + key + '/postbulk', controller.postBulk);
            app.put('/api/' + key, controller.put);
            app.patch('/api/' + key, controller.put);
            app.delete('/api/' + key, controller.delete);
        }
    }

    app.use(function (req, res, next) {
        res.status(404);
        res.json({
            error: 'Not found'
        });
        return;
    });

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            error: err.message
        });
        return;
    });
};