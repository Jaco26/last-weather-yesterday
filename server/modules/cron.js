const axios = require('axios');
const cron = require('node-cron');
const mongoose = require('mongoose');
const Zipcode = require('../models/Zipcode');
const WeatherSchema = require('../models/Weather');


const owmapiSearchByZip = 'https://api.openweathermap.org/data/2.5/weather?zip=';
// const owmapiSearchByZip = 'https://api.openweathermap.org/data/2.5/weather?q=';
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


function updateZipsWeather (zip_id, owmapiWeather) {
    let newWeather = new Weather(owmapiWeather);
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