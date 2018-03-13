const mongoose = require('mongoose');


const WeatherSchema = new mongoose.Schema({
    dateAdded: {type: Date, default: Date.now},
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
    rain: { three_hr: Number },
    snow: { three_hr: Number },
    dt: Number,
    sys: {
        type: Number,
        id: Number,
        message: Number,
        country: String,
        sunrise: Number,
        sunset: Number,
    },
    id: Number,
    name: String,
    cod: Number,
})


module.exports = WeatherSchema;

