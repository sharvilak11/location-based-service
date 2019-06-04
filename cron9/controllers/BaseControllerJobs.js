var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var odata = require('../odata');

module.exports = function (def) {
    var Model = def.model;
    Model.schema.plugin(deepPopulate);

    function getAll(req, res) {

        var query = Model.find();

        if (req.query.$select || req.query.$expand)
            query = odata.selectExpandParser(query, req.query.$select, req.query.$expand);

        if (req.query.$filter)
            query = odata.filterParser(query, req.query.$filter);

        if (req.query.$top)
            query = odata.topParser(query, req.query.$top);

        if (req.query.$skip)
            query = odata.skipParser(query, req.query.$skip);

        if (req.query.$orderBy)
            query = odata.orderByParser(query, req.query.$orderBy);

        query.exec(function (err, models) {
            if (err)
                res.status(500).send(err);
            else {
                res.status(200).json(models);
            }
        });
    }

    function getOne(req, res) {
        Model.findOne(querystring, function (err, model) {
            if (err)
                res.send(err);
            else {
                if (model)
                    res.json(model);
                else
                    res.status(404).json({
                        error: 'Not Found'
                    });
            }
        });
    }

    function postNew(req, res) {
        var data = new Model(req.body);
        data.AuditInfo = {};
        data.AuditInfo.CreatedByUser = req.user._id;
        data.save(function (err) {
            if (err)
                res.status(500).send(err);
            else {
                res.json(data);
            }
        });
    }

    function postBulk(req, res) {
        var items = req.body.Items;
        var error = [];
        var count = 0;
        for (var i = 0; i < items.length; i++) {
            var model = new Model(items[i]);
            model.AuditInfo = {};
            model.AuditInfo.CreatedByUser = req.user._id;
            model.save(function (err) {
                if (err) {
                    debugger;
                    return res.status(500).json({
                        error: err
                    })
                }
                count++;
                if (count == items.length)
                    res.status(200).json(items);
            });
        }
    }

    function putUpdate(req, res) {

        //query string that filters just the records with the requested Id, selected Brands or no Brand all together
        var querystring = {
            $and: [{
                _id: req.query._id
            }]
        };
        Model.findOne(querystring, function (err, data) {
            if (err)
                res.send(err);
            else {
                if (data) {
                    for (var field in req.body) {
                        data[field] = req.body[field];
                    }
                    if (data.AuditInfo) {
                        data.AuditInfo.EditedByUser = req.user._id;
                        data.AuditInfo.EditDate = new Date();
                    }
                    data.save(function (err) {
                        if (err)
                            res.status(500).send(err);
                        else {
                            res.status(200).json(data);
                        }
                    });
                } else
                    res.status(404).json({
                        error: 'Not Found'
                    });
            }
        });
    }

    function deleteOne(req, res) {

        Model.findOneAndRemove(querystring, function (err, data) {
            if (err)
                res.status(500).send(err);
            else {
                if (data) {
                    res.status(200).json('Item Deleted');
                } else
                    res.status(404).json({
                        error: 'Not Found'
                    });
            }
        });
    }

    var controller = {
        get: getAll,
        getById: getOne,
        post: postNew,
        postBulk: postBulk,
        put: putUpdate,
        delete: deleteOne
    };

    return controller;
}