const axios = require('axios');
const cron = require('node-cron');
const mongoose = require('mongoose');
const Zipcode = require('../models/Zipcode');
const WeatherSchema = require('../models/Weather');


const url = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const units = '&units=imperial';
const owmapiKey = process.env.OWMAPI_KEY;

const Weather = mongoose.model('Weather', WeatherSchema);


// run the code inside this cron.schedule once every 2 hours
// cron.schedule('2 * * * *', function () {
//     Zipcode.find({}, (error, response) => {
//         if (error) {
//             console.log('ERROR ON cron.schedule', error);
//         } else {
//             for (let zip of response) {
//                 axios.get(url + zip.zipcode + owmapiKey + units)
//                     .then(response => {
//                         // console.log('RESPONSE DATA', response.data);
//                         updateZipsWeather(zip._id, response.data)
//                     }).catch(error => {
//                         console.log(error);
//                     });
//             }
//         }
//     });
// });


function updateZipsWeather (zip_id, weather) {
    let newWeather = new Weather(weather);
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