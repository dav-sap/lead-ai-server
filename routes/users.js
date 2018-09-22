import {getNextStage} from "../src/Bot";
const express = require('express');
const router = express.Router();
const users = require('./../db/users.js');
const consultants = require('./../db/consultants');

// var photographers = require('./../db/photographers');

// router.post('/referenced_user', function (req, res, next) {
//     let reqBody = req.body;
//     Promise.all([ photographers.findOne({phoneNumber: reqBody.referencedPhotographer}), consultants.findOne({phoneNumber: reqBody.referred})])
//     .then((args) => {
//         let consultant = args[1];
//         let photographer = args[0];
//         if (consultant && consultant._id && photographer && photographer._id) {
//             let reference = {photographer: photographer._id, consultant: consultant._id, date: new Date()};
//              return users.findOneAndUpdate({phoneNumber: reqBody.phoneNumber, email: reqBody.email}, {$push: {references: reference}});
//         } else throw {message: "Could not find consultant or photographer"}
//     }).then((user) => {
//         if (user) {
//             res.send({info: "User " + reqBody.email + " updated", user: user})
//         } else throw {message: "Could not find user to update"}
//     }).catch( (err) => {
//         res.status.send(500)({error:"Can't update user",  info: err.message});
//     })
// });
router.get('/get_users', function (req, res, next) {
    users.find({}).then( (users) =>{
        res.send({info: "User Found: ", users: users})
    }).catch(err => res.status(500).send({error: "Error find users", info: "User Founod"}));
});
//TODO:: remove from future use
router.get('/get_user', function (req, res, next) {
    var userJson = req.headers;
    if (userJson.phonenumber && userJson.email) {
        users.findOne({phoneNumber: userJson.phonenumber, email:userJson.email}, function (err, user) {
            if (err) {
                res.send({success: false, info: "User not found Error:  " + err.message})
            } else {
                if (user) {
                    res.send({success: true, info: "User Found: ", user: user})
                } else {
                    res.send({success: false, info: "User not found Error: No user found for email: "+userJson.email+": ,and phone number: "+userJson.phoneNumber})

                }
            }
        }).
        populate('references.consultant references.photographer').exec(function (err, user) {
            console.log('The consultant 1 %s', user);
            console.log('The consultant is %s', user.references[0].consultant.name);
        });
    } else {
        res.send({success: false, info: "Get User error: phone number: "+ userJson.phoneNumber + ", or email: " + userJson.email + ". Not Correct"})
    }

});

router.post('/remove_user', function (req, res, next) {
    let userToRemoveJson = req.body;
    users.findOneAndRemove({phoneNumber: userToRemoveJson.phoneNumber, email: userToRemoveJson.email}).then((user) => {
        if (user) {
            res.send({info: "User Found and removed"})
        } else throw {message: "No user found for email: " + userToRemoveJson.email + ": ,and phone number: " + userToRemoveJson.phoneNumber}
    }).catch( (err) => {
        res.status.send(500)({error: "User not removed!", info: err.message})
    })
});

router.post('/add_user', function (req, res, next) {
    let userJson = req.body;
    let startDate = new Date();
    users.create({name:userJson.name, chat: {data: [], date: startDate}}).then( (newUser) => {
        res.send({info:"User saved!", user: newUser, chatStartDate: startDate})
    }).catch((err) => {
        res.status(500).send({error: "User error", info:err.message})
    })

});

router.post('/add_chat_answer', function (req, res, next) {
    let reqBody = req.body;
    users.findOneAndUpdate({_id: reqBody._id}, {$push: {'chat.data': {question: reqBody.question, answer: reqBody.answer.value}}})
        .then(user => {
			if (!user) {
				let startDate = new Date();
				users.create({name: reqBody.answer.value, chat: {data: [], date: startDate}})
                .then(newUser => {
					res.send({info: "Answer submitted", newUser: newUser, stage: getNextStage(reqBody.question, reqBody.answer)})
				})
			} else {
				res.send({info: "Answer submitted", user: user, stage: getNextStage(reqBody.question, reqBody.answer, reqBody._id )})
			}
        }).catch(err => {
        	console.error(err.toString());
            res.status(500).send({error: "Chat Answer not added", info: err.toString()})
        })
});

module.exports = router;
