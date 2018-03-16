const express = require('express');
const router = express();
const mongoose = require('../modules/db-config');
// Models
const User = require('../models/User');
const Zipcode = require('../models/Zipcode');

let zipcodes = [];

// Post a zipcode to the zipcodes collection and then
// find user by id and update their zipcodeDate document with 
// the ObjectId of the saved zipcode (see /models/User.js)
router.post('/zipcode/:userId', (req, res) => {
    let userId = req.params.userId;
    let zipcodeToAdd = new Zipcode(req.body);
    zipcodeToAdd.save((error, savedZipcode) => {
        if (error) {
            console.log('error on post zipcode', error);
            res.sendStatus(500);     
        } else {
            console.log('savedZipcode:', savedZipcode);
            User.findByIdAndUpdate(
                { "_id": userId },
                { $push: { zipcodeDate: { zipcode: savedZipcode._id } } },
                (pusherror, doc) => {
                    if (pusherror) {
                        console.log('error on push zipcode to user.zipcodeDate', pusherror);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                }
            );
        }
    });
});


// Get the user's zip codes from users collection and the weather 
// stored in each one's document in the zipcodes collection
router.get('/zipcode/:userId', (req, res) => {
    // let userId = req.params.userId;
    Zipcode.find({}).populate('users').exec( (error, foundUser) => {
        if(error) {
            console.log('Error on find', error);
            res.sendStatus(500);
        } else {
            res.send(foundUser)
        }
    })
})





module.exports = router;



