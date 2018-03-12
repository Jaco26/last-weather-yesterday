const mongoose = require('mongoose');
const CommentSchema = require('./Comments');


const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    zipcodeDate: [ {startTrackDate: {type: Date, default: Date.now}, zipcode: {type: mongoose.Schema.ObjectId, ref: 'zipcodes'}} ],
    comments: [CommentSchema]
}); 


module.exports = mongoose.model('User', UserSchema, 'users');