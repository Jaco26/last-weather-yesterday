const mongoose = require('mongoose');
const WeatherSchema = require('./Weather'); 

const ZipcodeSchema = new mongoose.Schema({
    zipcode: String,
    weather: [WeatherSchema],
}); 

module.exports = mongoose.model('Zipcode', ZipcodeSchema, 'zipcodes');
