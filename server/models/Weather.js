const mongoose = require('mongoose');

const SysSchema = new mongoose.Schema({
    type: Number,
    id: Number,
    message: Number,
    country: String,
    sunrise: Number,
    sunset: Number,
}); 



const WeatherSchema = new mongoose.Schema({
    coord: { lon: Number, lat: Number },
    weather: [{
        id: Number,
        main: String,
        description: String,
    }],
    main: {
        temp: Number,
        pressure: Number,
        humidity: Number,
        temp_min: Number,
        temp_max: Number
    },
    visibility: Number,
    wind: {
        speed: Number,
        deg: Number,
    },
    clouds: { all: Number },
    rain: { "3hr": Number },
    snow: { "3hr": Number },
    dt: Number,
    sys: {
        type: {type: Number},
        id: Number,
        message: String,
        country: String,
        sunrise: Number,
        sunset: Number
    },
    id: Number,
    name: String,
    cod: Number,
})


module.exports = WeatherSchema;

