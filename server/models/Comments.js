const mongoose = require('mongoose');


const CommentSchema = new mongoose.Schema({
    comment: String,
    relatedDate: {type: Date, required: true}
});


module.exports = CommentSchema;