const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    zipcodeDate: [ {startTrackDate: {type: Date, default: Date.now}, zipcode: {type: mongoose.Schema.ObjectId, ref: 'zipcodes'}} ],
    // zipcodes: [ {type: mongoose.Schema.ObjectId, ref: 'zipcodes'} ],
}); 

module.exports = mongoose.model('User', UserSchema, 'users');