const mongoose = require('mongoose');


const CommentSchema = new mongoose.Schema(
    {
        comment: String,
        relatedDate: {
            type: Date, 
            required: true
        },
        relatedZip: {
            type: mongoose.Schema.ObjectId,
            ref: 'zipcodes',
        },
        dateAdded: Date,
    }
);


module.exports = mongoose.model('Comment', CommentSchema, 'comments');