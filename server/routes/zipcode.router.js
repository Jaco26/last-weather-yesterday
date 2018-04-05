const express = require('express');
const router = express();
const mongoose = require('../modules/db-config');
const moment = require('moment');
// Models
const User = require('../models/User');
const Zipcode = require('../models/Zipcode');
// database zipcode submission validation module
const validateZipcodeAndSave = require('../modules/validate-zip-submissions');


// GET all user's zipcodes and associated weather data
router.get('/:zipId', (req, res) => {
    let zipId = req.params.zipId;
    Zipcode.findById({ "_id": zipId }).populate('users').exec((err, response) => {
        if (err) {
            console.log('Error on find', err);
            res.sendStatus(500);
        } else {
            // console.log('foundZipcodes:', response);
            res.send(response)
        }
    });
});


// Post a zipcode to the zipcodes collection and then
// find user by id and update their zipcodeDate document with 
// the ObjectId of the saved zipcode (see /models/User.js)
router.post('/:userId', (req, res) => {
    if(req.isAuthenticated()) {
        let userId = req.params.userId;
        let zipcodeToAdd = new Zipcode(req.body); // new instance of Zipcode model
        validateZipcodeAndSave(zipcodeToAdd, userId, res);
    } else {
        res.sendStatus(403);
    }  
});

// This database query gets back the last weeks worth of weather data
// for Minneapolis to be used on the demo section of the login page
// so potential users don't have to create an account and wait a couple of days 
// to start having fun! 
router.get('/', (req, res) => {
    let today = new Date().toDateString();
    today = new Date(today);
    let oneWeekAgo = new Date(today.setDate(today.getDate() - 7));
    Zipcode.aggregate([
        {"$unwind": "$weather"},
        { "$match": { "$and": [{ "weather.dt": { "$gte": oneWeekAgo } }, { "zipcode": /55404/ }] } }])
        .limit(200)
        .exec( (err, response) => {
            if (err) {
                console.log(err);
            } else {
                res.send(response)
            }
        }
    )
});

module.exports = router;

