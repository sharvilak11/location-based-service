var crypto = require('crypto');
var mongoose = require('mongoose');
var User = require('../models/User').model;
var Claim = require('../models/UserClaim').model;
var AccessToken = require('../models/AccessToken').model;
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;

module.exports = function(app) {
    app.post('/register', function (req, res) {
        if (!req.body.UserName || !req.body.Password)
            res.status(400).json({
                error: "Bad Request"
            });
        if (req.body.UserName) {
            var newUser = new User(req.body);
            newUser.Email = newUser.UserName;
            newUser.Phone = newUser.Phone;
            newUser.EmailConfirmed = false;
            newUser.LockoutEnabled = false;
            newUser.PhoneConfirmed = false;
            newUser.PasswordHash = newUser.EncryptPassword(req.body.Password);
            newUser.save(function (err) {
                if (err)
                    res.status(500).json({
                        error: err
                    })
                else {
                    var newUserClaim = new Claim();
                    newUserClaim.UserId = newUser._id;
                    newUserClaim.ClaimType = "Cron";
                    newUserClaim.ClaimValue = "*";
                    newUserClaim.save(function (err) {
                        if (err) {
                            res.status(500).json({
                                error: err
                            })
                        } else {
                            var verificationLink = process.env.SERVER + "/verifyuseremail?username=" + newUser.UserName;
                            //email.helper.sendUserVerificationEmail(verificationLink, newUser.Email, req.body.Password);
                            res.status(200).json(newUser);
                        }
                    })
                }
            });
        }
    });
    app.post('/changepassword', function(req, res) {
        if (!req.body.UserName || !req.body.Password || !req.body.NewPassword)
            res.status(400).json({
                error: "Bad Request"
            });
        if (req.body.NewPassword == req.body.Password) {
            res.status(404).json({
                eror: "New password is same as previous password"
            });
        }
        var query = {
            UserName: req.body.UserName
        };
        User.findOne(query, function(err, user) {
            if (err)
                res.status(500).json({
                    error: 'An Error Occured.'
                })
            if (user) {
                if (user.ValidatePassword(req.body.Password, user.PasswordHash)) {
                    user.PasswordHash = user.EncryptPassword(req.body.NewPassword);
                    user.save(function(err) {
                        if (err)
                            res.status(500).json({
                                error: err
                            })
                        else {
                            var query = {
                                UserId: user._id
                            };

                            Claim.find(query, function(err, claims) {
                                if (err) {
                                    res.status(500).json({
                                        error: err
                                    })
                                }

                                claimsValue = claims.map(function(i) {
                                    return i.ClaimType + ': *';
                                }).join("|");

                                AccessToken.remove({
                                    UserId: user._id
                                }, function() {});
                                var accesstoken = new AccessToken({
                                    UserId: user._id,
                                    TokenString: crypto.randomBytes(32).toString('hex'),
                                    UserName: user.UserName,
                                    UserTenantId: '*',
                                    Claims: claimsValue
                                });

                                accesstoken.save(function(err) {
                                    if (err)
                                        res.status(500).json({
                                            error: 'An Error Occured during Token Generation.'
                                        });
                                    else {
                                        res.status(200).json(accesstoken);
                                    }
                                });
                            });
                        }
                    })
                } else
                    res.status(401).json({
                        error: 'Incorrect Password.'
                    });
            } else
                res.status(404).json({
                    error: 'Please login again'
                })
        })
    });
    app.post('/login', function(req, res) {
        if (!req.body.UserName || !req.body.Password)
            res.status(400).json({
                error: "Bad Request"
            });
        var query = {
            UserName: req.body.UserName
        };
        User.findOne(query, function(err, user) {
            if (err)
                res.status(500).json({
                    error: 'An Error Occured.'
                })

            if (user) {
                if (user.ValidatePassword(req.body.Password, user.PasswordHash)) {
                    var claimquery = {
                        UserId: user._id
                    };

                    Claim.find(claimquery, function(err, claims) {
                        if (err) {
                            res.status(500).json({
                                error: err
                            })
                        }

                        claimsValue = claims.map(function(i) {
                            return i.ClaimType + ': *';
                        }).join("|");

                        var accesstoken = new AccessToken({
                            UserId: user._id,
                            TokenString: crypto.randomBytes(32).toString('hex'),
                            UserName: user.UserName,
                            UserTenantId: '*',
                            Claims: claimsValue
                        });

                        accesstoken.save(function(err) {
                            if (err)
                                res.status(500).json({
                                    error: 'An Error Occured during Token Generation.'
                                });
                            else {
                                res.status(200).json(accesstoken);
                            }
                        });
                    });

                } else
                    res.status(401).json({
                        error: 'Incorrect Password.'
                    })
            } else
                res.status(401).json({
                    error: 'User Not Found.'
                })
        });
    });
}