var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validators = require('mongoose-validators');
var schemaConsts = require('./consts');

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
    chat: [{data: [{question: String, answer: String}], date: Date}],
    // references: [{photographer: {type: mongoose.Schema.Types.ObjectId, ref:photographersSchema.modelName}, consultant: {type: mongoose.Schema.Types.ObjectId, ref:consultantsSchema.modelName}, date: Date}],
});



module.exports = mongoose.model(schemaConsts.USERS, usersSchema);
