const mongoose = require('mongoose');
const CommentSchema = require('./Comments');
const PhotosSchema = require('./Photos');


const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String, 
            required: true, 
            index: {unique: true}},
        password: {
            type: String, 
            required: true
        },
        zipcode: [ 
            { 
                startTrackDate: {
                    type: Date, 
                    default: Date.now
                }, 
                zipId: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'zipcodes'
                },
                isPrimary: Boolean,
            } 
        ],
        comments: [CommentSchema],
        photos: [PhotosSchema],
}); 


module.exports = mongoose.model('User', UserSchema, 'users');