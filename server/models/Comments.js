const mongoose = require('mongoose');


const CommentSchema = new mongoose.Schema({
    comment: String,
    dateAdded: {type: Date, default: Date.now}
});


module.exports = CommentSchema;