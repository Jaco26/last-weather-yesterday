const axios = require('axios');
const cron = require('node-cron');
const mongoose = require('mongoose');
// Zipcode model
const Zipcode = require('../models/Zipcode');
// Weather schema
const WeatherSchema = require('../models/Weather');
// OMAPI
const owmapiSearchByZip = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const units = '&units=imperial';
const owmapiKey = process.env.OWMAPI_KEY;
// Weather model
const Weather = mongoose.model('Weather', WeatherSchema);

function kelvinToFahrenheit(kelvin) {
    let fahrenheit = kelvin * 9 / 5 - 459.67;
    return Math.round(fahrenheit * 10) / 10;
}

function metersPerSecondToMph (vInMps) {
    let mph =  vInMps * 2.2369;
    return Math.round(mph * 10) / 10;
}

function metersToMiles (meters) {
    let miles = meters / 1610;
    return Math.round(miles * 10) / 10;
}

function unixTimestampToJsDate(timestamp) {
    return new Date(timestamp * 1000);
}

function windDirectionInDegreesToCompassInitials (deg) {
    if (deg >= 11.26 && deg <= 33.75) {
        return 'NNE';
    } else if (deg >= 33.76 && deg <= 56.25) {
        return 'NE';
    } else if (deg >= 56.26 && deg <= 78.75) {
        return 'ENE';
    } else if (deg >= 78.76 && deg <= 101.25) {
        return 'E';
    } else if (deg >= 101.26 && deg <= 123.75) {
        return 'ESE';
    } else if (deg >= 123.76 && deg <= 146.25) {
        return 'SE';
    } else if (deg >= 146.26 && deg <= 168.75) {
        return 'SSE';
    } else if (deg >= 168.76 && deg <= 191.25) {
        return 'S';
    } else if (deg >= 191.26 && deg <= 213.75) {
        return 'SSW';
    } else if (deg >= 213.76 && deg <= 236.25) {
        return 'SW';
    } else if (deg >= 236.26 && deg <= 258.75) {
        return 'WSW';
    } else if (deg >= 258.76 && deg <= 281.25) {
        return 'W';
    } else if (deg >= 281.26 && deg <= 303.75) {
        return 'WNW';
    } else if (deg >= 303.76 && deg <= 326.25) {
        return 'NW';
    } else if (deg >= 326.26 && deg <= 348.75) {
        return 'NNW';
    } else {
        return 'N';
    }
}

function convertOwmapiResponseData (data) {
    data.main.temp = kelvinToFahrenheit(data.main.temp);
    data.main.temp_min = kelvinToFahrenheit(data.main.temp_min);
    data.main.temp_max = kelvinToFahrenheit(data.main.temp_max);
    data.wind.speed = metersPerSecondToMph(data.wind.speed);
    data.dt = unixTimestampToJsDate(data.dt);
    data.sys.sunrise = unixTimestampToJsDate(data.sys.sunrise);
    data.sys.sunset = unixTimestampToJsDate(data.sys.sunset);
    data.wind.deg = windDirectionInDegreesToCompassInitials(data.wind.deg);
    data.visibility = metersToMiles(data.visibility);
    let convertedData = data;
    return convertedData;
}

function getWeather (baseUrl, zipcode, apiKey) {
    console.log(baseUrl + zipcode + apiKey);
    
    axios.get(baseUrl + zipcode.zipcode + apiKey) // apparently kelvin temperatures are much more accurate...
        .then(response => {
            weather = convertOwmapiResponseData(response.data)
            updateZipsWeather(zipcode._id, weather)
        }).catch(error => {
            console.log(error);
        });
}

// run the code inside this cron.schedule once every hour
//   cron.schedule('0 */1 * * *', function ()
// run the code inside this cron.schedule once every hour
// cron.schedule('0 */1 * * *', function () {
cron.schedule('0 */1 * * *', function () {
    Zipcode.find({}, (error, response) => {
        if (error) {
            console.log('ERROR ON cron.schedule', error);
        } else {
            let date = new Date();
            for (let zip of response) {
                getWeather(owmapiSearchByZip, zip, owmapiKey);
            }
        }
    });
});


function updateZipsWeather (zip_id, owmapiWeather) {
    let newWeather = new Weather(owmapiWeather);
    Zipcode.findByIdAndUpdate(
        {"_id": zip_id},
        {$push: {weather: newWeather}},
        (pusherror, updatedDoc) => {
            if(pusherror){
                console.log('PUSHERROR', pusherror);                
            } else {
                console.log('Updated zipcode document', updatedDoc);
            }
        }
    )
}

module.exports = cron;