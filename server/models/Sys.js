const mongoose = require('mongoose');


const SysSchema = new mongoose.Schema({
    type: Number,
    id: Number,
    message: Number,
    country: String,
    sunrise: Number,
    sunset: Number,
}); 


module.exports = SysSchema;