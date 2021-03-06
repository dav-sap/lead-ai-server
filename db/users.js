var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validators = require('mongoose-validators');
var schemaConsts = require('./consts');
var consultantsSchema = require('./consultants');

var usersSchema = new Schema({
    name:  {type: String, required: true},

    email: {type: String, validate: validators.isEmail(), trim: true, index: {
            unique: true,
            partialFilterExpression: {email: {$type: 'string'}}
        }
    },
    phoneNumber: {type: String, validate: [validators.isNumeric(), validators.isLength(10,10)], trim: true, index: {
            unique: true,
            partialFilterExpression: {email: {$type: 'string'}}
        }
    },
    chat: {data: [{question: {key: Number, text: String}, answer: String}], date: Date},
	referenced: {type: mongoose.Schema.Types.ObjectId, ref:consultantsSchema.modelName}
});



module.exports = mongoose.model(schemaConsts.USERS, usersSchema);
