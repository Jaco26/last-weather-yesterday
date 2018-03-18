const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema(
    {
        photoUrl: String,
        relatedDate: {
            type: Date, 
            required: true
        },
        relatedZip: {
            type: mongoose.Schema.ObjectId,
            ref: 'zipcodes'
        },
    }
);

module.exports = PhotoSchema;
