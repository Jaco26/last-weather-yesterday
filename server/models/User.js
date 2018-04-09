const mongoose = require('mongoose');



const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String, 
            required: true, 
            index: {unique: true},
            unique: true,
        },
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
                isPrimary: {type: Boolean, default: false},
            } 
        ],
        comments: [
            {
                commentId: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'comments',
                }
            }
        ],
}); 


module.exports = mongoose.model('User', UserSchema, 'users');