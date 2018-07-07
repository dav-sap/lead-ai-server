var express = require('express');
var async = require('async');
var router = express.Router();
var photographers = require('../db/oldPhotographers.js');
var consultants = require('./../db/consultants.js');
var users = require('./../db/users.js');


router.post('/new_photographer', function (req, res, next) {
    let newPhotographerJson = req.body;
    photographers.create(newPhotographerJson).then((newPhotographer) => {
        if (newPhotographer) {
            res.send({success: true, info: "New Photographer saved!", photographer: newPhotographer});
        } else {
            throw new {message: "Photographer couldn't be added"};
        }
    }).catch((err) => {
        res.send({success: false, error: "Photographer not added", info: err.message});
    })
});
router.post('/remove_photographer', function (req, res, next) {
    let photographerToRemoveJson = req.body;
    photographers.findOneAndRemove({email: photographerToRemoveJson.email, phoneNumber: photographerToRemoveJson.phoneNumber}).then ((photographer) =>{
        if (photographer) {
            res.send({success: true, info: "Photographer Found and removed", photographer: photographer})
        } else throw {message: "No photographer found for email: " + photographerToRemoveJson.email + " or phone number: " + photographerToRemoveJson.phoneNumber}

    }).catch((err) => {
        res.send({success: false, error: "Photographer Not Removed", info: err.message})
    })
});
router.post('/add_availability', function (req, res, next) {
    let photographerJson = req.body;
    photographers.findOne({phoneNumber: photographerJson.phoneNumber, email: photographerJson.email}
    ).then((photographer) => {
        if (!photographerJson.availability) {
            throw {message: "Photographer availability: " + photographerJson.availability +", Not correct"};
        }
        if (photographer) {
            photographerJson.availability.forEach((element) => {
                if (element.startDate && element.endDate) {
                    photographer.availability.push({
                        startDate: new Date(element.startDate),
                        endDate: new Date(element.endDate)
                    });
                } else throw {message: "Error parsing startDate and endDate"};
            });
            return photographer;
        } else throw {message: "No photographer found for email: " + photographerJson.email + " or phone number: " + photographerJson.phoneNumber};
    }).then((photographer) => {
        return photographer.save();
    }).then ((updatedPhotographer) => {
        if (updatedPhotographer) {
            res.send({success: true, info: "Photographer Found, availability added", availability:updatedPhotographer.availability})
        } else throw {message: "Error while saving new availability"};
    }).catch((err) => {
        res.send({success: false, error: "Photographer availability not added", info:err.message})
    })
});

router.post('/add_lead', function (req, res, next) {
    var photographerJson = req.body.photographer;
    var consultantJson = req.body.consultant;
    var userJson = req.body.user;
    if (photographerJson && consultantJson && userJson) {
        async.parallel({
            consultantRes: (cb) => {
                if (consultantJson.phoneNumber && consultantJson.email) {
                    consultants.findOne({phoneNumber: consultantJson.phoneNumber, email: consultantJson.email}, function (err, consultant) {
                        if (err) {
                            cb({error:"No Document Found", info: err.message});
                        } else if (!consultant) {
                            cb({error:"No Document Found", info: "No consultant found for phone number: "+ consultantJson.phoneNumber + ", email: " + consultantJson.email + ". Incorrect"});
                        } else {
                            cb(null, {consultant: consultant});
                        }
                    });
                } else {
                    cb({error:"CONSULTANT JSON ERROR", info: "phone number: "+ consultantJson.phoneNumber + ", email: " + consultantJson.email + ". Not Correct"});
                }
            },
            userRes: (cb) => {
                if (userJson.phoneNumber && userJson.email) {
                    users.findOne({phoneNumber: userJson.phoneNumber, email: userJson.email}, function (err, user) {
                        if (err) {
                            cb({error:"No Document Found", info: err.message});
                        } else if (!user) {
                            cb({error:"No Document Found", info: "No user found for phone number: "+ userJson.phoneNumber + ", email: " + userJson.email + ". Incorrect"});
                        } else {
                            cb(null, {user: user});
                        }
                    });
                } else {
                    cb({error:"USER JSON ERROR", info: "phone number: "+ userJson.phoneNumber + ", email: " + userJson.email + ". Incorrect"});
                }
            },
            photographerRes: (cb) => {
                if (photographerJson.phoneNumber && photographerJson.email) {
                    photographers.findOne({phoneNumber: photographerJson.phoneNumber, email: photographerJson.email}, function (err, photographer) {
                        if (err) {
                            cb({error:"No Document Found", info: err.message});
                        } else if (!photographer) {
                            cb({error:"No Document Found", info: "No photographer found for phone number: "+ photographerJson.phoneNumber + ", email: " + photographerJson.email + ". Incorrect"});
                        } else {
                            cb(null, {photographer: photographer});
                        }
                    });
                } else {
                    cb({error:"PHOTOGRAPHER JSON ERROR", info: "phone number: "+ photographerJson.phoneNumber + ", email: " + photographerJson.email + ". Incorrect"});
                }
            },
        }, (err, results) =>{
            if (err) {
                res.send({success: false, error: err.error, info: err.info})
            } else {
                results.photographerRes.photographer.leads.push({user: results.userRes.user, consultant: results.consultantRes.consultant, successful: undefined});
                results.photographerRes.photographer.save(function (err, updatedPhotographer) {
                    if (err) {
                        res.send({
                            success: false,
                            error: "Saving Document Error",
                            info: "Error while saving new lead: " + err.message
                        });
                    } else {
                        res.send({success: true, info: "Lead added", leads: updatedPhotographer.leads})
                    }
                });
            }
        });
    } else {
        res.send({success: false, error:"JSON ERROR", info: "Photographer Json: " + photographerJson + ". Consultant Json: " +consultantJson + ". User Json: " +userJson +". Incorrect"})
    }
});
module.exports = router;

router.post('/update_lead_status', function (req, res, next) {
    var reqBody = req.body;
    var photographerJson = reqBody.photographer;
    var userJson = reqBody.user;
    if (photographerJson && userJson && photographerJson.email && photographerJson.phoneNumber && userJson.phoneNumber && userJson.email && photographerJson && reqBody.successful)  {
        photographers.findOne({phoneNumber: photographerJson.phoneNumber, email: photographerJson.email}).
        populate({path: 'leads.user', model: users }).exec(function (err, photographer) {
            if (err) {
                res.send({success: false, error: "Populating Error", info: "Error while populating user in leads array for photographer"})
            }
            var leadToUpdate = undefined;
            for (var i=0; i < photographer.leads.length; i++) {
                if (photographer.leads[i].user) {
                    if (photographer.leads[i].user.phoneNumber === userJson.phoneNumber && photographer.leads[i].user.email === userJson.email) {
                        leadToUpdate = photographer.leads[i];
                        photographer.leads[i].successful = reqBody.successful;
                        photographer.save(function (err, updatedPhotographer, i) {
                            if (err) {
                                res.send({
                                    success: false,
                                    error: "Saving Document Error",
                                    info: "Error while saving new lead: " + err.message
                                });

                            } else {
                                res.send({success: true, info: "Lead Found, lead update: " + updatedPhotographer.leads[i]});
                            }
                        }, i);
                        break;
                    }
                } else {
                    res.send({success: false, error: "Populating Error", info: "Error while populating user in leads array for photographer"})
                    return;
                }
            }
            if (!leadToUpdate) {
                res.send({success: false, error: "No Document Found", info: "No lead found for user email: "+ userJson.email + " and phone number: " + userJson.phoneNumber})
            }
        });
    }
});