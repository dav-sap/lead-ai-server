var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validators = require('mongoose-validators');
var usersSchema = require('./users');
var consultantsSchema = require('./consultants');
var schemaConsts = require('./consts');

var photographersSchema = new Schema({
    name:  {type: String, required: true},
    email: {type: String, validate: validators.isEmail(), required: true, unique: true},
    phoneNumber:  {type: String, validate: [validators.isNumeric(), validators.isLength(10,10)], required: true, unique: true},
    availability: [{startDate:Date, endDate: Date}],
    leads: [{user: {type: mongoose.Schema.Types.ObjectId, ref:usersSchema.modelName}, consultant: {type: mongoose.Schema.Types.ObjectId, ref:consultantsSchema.modelName}, successful: Boolean}],
    website: {type: String, validate: validators.isURL()},
    facebook: {type: String, validate: validators.isURL()}

});

module.exports = mongoose.model(schemaConsts.PHOTOGRAPHERS, photographersSchema);