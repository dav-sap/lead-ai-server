const express = require('express');
const router = express.Router();
const users = require('./../db/users.js');
const consultants = require('./../db/consultants.js');
import {hello_get_name} from './../src/Bot'

router.post('/start_chat', function (req, res, next) {
	res.send(JSON.stringify(hello_get_name))
});

router.post('/analyze_data', (req, res, next) => {
	consultants.find({}, (err, consultants) => {
		return consultants
	}).then(consultants => {
		let chosenConsultant = consultants[Math.floor(Math.random() * consultants.length)];
		return users.findOneAndUpdate({_id: req.body.user._id}, {$set: {'referenced': chosenConsultant}}, {new: true});
	}).then(user => {
		if (!user) {
			console.error("No user found for ", req.body.user);
			res.status(400).send({error: "Consultant not fetched. No user found"})
		} else {
			res.send({info: "Added consultant to user"})
		}
	}).catch(err => {
		console.error(err.toString());
		res.status(500).send({error: "Error adding consultant to user"})
	})
});

module.exports = router;
