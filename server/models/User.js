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
                commentId: mongoose.Schema.ObjectId,
            }
        ],
        photos: [
            {
                photoId: mongoose.Schema.ObjectId,
            }
        ],
}); 


module.exports = mongoose.model('User', UserSchema, 'users');