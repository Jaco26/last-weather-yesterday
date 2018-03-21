const axios = require('axios');
const cron = require('node-cron');
const mongoose = require('mongoose');
const Zipcode = require('../models/Zipcode');
const WeatherSchema = require('../models/Weather');


const owmapiSearchByZip = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const units = '&units=imperial';
const owmapiKey = process.env.OWMAPI_KEY;

const Weather = mongoose.model('Weather', WeatherSchema);


// run the code inside this cron.schedule once every 2 hours
//   cron.schedule('0 */2 * * *', function ()
// run the code inside this cron.schedule once every hour
cron.schedule('0 */1 * * *', function () {
    Zipcode.find({}, (error, response) => {
        if (error) {
            console.log('ERROR ON cron.schedule', error);
        } else {
            for (let zip of response) {
                console.log('------- ZIP of RESPONSE', zip);
                
                axios.get(owmapiSearchByZip + zip.zipcode + owmapiKey + units)
                .then(response => {
                    updateZipsWeather(zip._id, response.data)
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    });
});

Zipcode.find({}, (error, response) => {
    if (error) {
        console.log('ERROR ON cron.schedule', error);
    } else {
        for (let zip of response) {
            axios.get(owmapiSearchByZip + zip.zipcode + owmapiKey + units)
                .then(response => {
                    console.log('------------- RESPONSE DATA', response.data);
                    
                    updateZipsWeather(zip._id, response.data)
                }).catch(error => {
                    console.log(error);
                });
        }
    }
});



function updateZipsWeather (zip_id, owmapiWeather) {
    console.log('OWMAPI WEATHER', owmapiWeather);
    /* Here, I'm rewiting the sys object returned from 
    owmapi. For some reason unbeknownst to me or any of the 
    instructors at Prime, "sys" and all of its properties would 
    NOT write to the database. Everything else in my mongoose 
    Schema modeled successfully...just not "sys" */
    let mongoWeather = owmapiWeather;
    mongoWeather.newSysThing.type = owmapiWeather.sys.type;
    mongoWeather.newSysThing.id = owmapiWeather.sys.id;
    mongoWeather.newSysThing.message = owmapiWeather.sys.message;
    mongoWeather.newSysThing.country = owmapiWeather.sys.country;
    mongoWeather.newSysThing.sunrise = owmapiWeather.sys.sunrise;
    mongoWeather.newSysThing.sunset = owmapiWeather.sys.sunset;

    // console.log('WEATHER RETURNED FROM OWMAPI:', weather);
    // console.log("WEATHER.SYS:", weather.sys);
    
    // // weather.taco = weather.sys;
    // console.log(' ---------------- WEATHER:', weather);
    // console.log(' ---------------- weather.sys.sunrise', weather.sys.sunrise);
    
    // let tempWeather = weather;
    // console.log(' ---------------- TEMP WEATHER', tempWeather);
    // console.log(' ---------------- weather.sys.sunrise', weather.sys.sunrise);
    // tempWeather.sunrise = weather.sys.sunrise;
    // console.log(' ---------------- TEMP WEATHER', tempWeather);
    // console.log(' ---------------- weather.sys.sunrise', weather.sys.sunrise);

    let newWeather = new Weather(mongoWeather);
    console.log(' ---------------- NEW WEATHER', newWeather);
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