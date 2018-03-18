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
    }
);


module.exports = CommentSchema;