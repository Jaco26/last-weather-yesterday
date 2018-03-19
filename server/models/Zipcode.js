const mongoose = require('mongoose');
const WeatherSchema = require('./Weather'); 

const ZipcodeSchema = new mongoose.Schema({
    zipcode: {
        type: String, 
        unique: true
    },
    weather: [WeatherSchema],
}); 

module.exports = mongoose.model('Zipcode', ZipcodeSchema, 'zipcodes');
