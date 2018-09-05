var express = require('express');
var router = express.Router();
import {hello_get_name, getHelloString} from './../src/Bot'

router.post('/start_chat', function (req, res, next) {
	hello_get_name.question = getHelloString();
	res.send(JSON.stringify(hello_get_name))
});

module.exports = router;
