const express = require('express');
const router = express.Router();

const axios = require('axios'); 

const zipUrl = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const units = '&units=imperial';
const owmapiKey = process.env.OWMAPI_KEY;

// axios.get(zipUrl + '55454' + owmapiKey + units).then(response => {
//     console.log(response.data);
    
// })



module.exports = axios;