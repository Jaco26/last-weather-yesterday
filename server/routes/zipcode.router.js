const express = require('express');
const router = express();
const mongoose = require('../modules/db-config');
// Models
const User = require('../models/User');
const Zipcode = require('../models/Zipcode');

let zipcodes = [];
let zipcodeIsUnique = true;


// GET all user's zipcodes and associated weather data
router.get('/zipcode/:zipId', (req, res) => {
    let zipId = req.params.zipId;
    Zipcode.findById({ "_id": zipId }).populate('users').exec((error, foundZipcodes) => {
        if (error) {
            console.log('Error on find', error);
            res.sendStatus(500);
        } else {
            // console.log('foundZipcodes:', foundZipcodes);
            res.send(foundZipcodes)
        }
    })
})


// Post a zipcode to the zipcodes collection and then
// find user by id and update their zipcodeDate document with 
// the ObjectId of the saved zipcode (see /models/User.js)
router.post('/zipcode/:userId', (req, res) => {
    let userId = req.params.userId;
    let zipcodeToAdd = new Zipcode(req.body);
    // findZip(zipcodeToAdd, userId);
    zipcodeToAdd.save((error, savedZipcode) => {
        if (error) {
            console.log('error on post zipcode', error);
            res.sendStatus(500);     
        } else {
            console.log('savedZipcode:', savedZipcode);
            User.findByIdAndUpdate(
                { "_id": userId },
                { $push: { zipcode: { zipId: savedZipcode._id } } },
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


function findZip(zipcode, userId) {
    // console.log(zipcode);
    Zipcode.find({ "zipcode": zipcode.zipcode }, (error, foundZipcode) => {
        if (error) {
            console.log('ERROR ON UNIQUE ZIP TEST', error);
        } else {
            if (foundZipcode[0]) {
                // console.log('ZIPCODE IS NOOOOOOTTTTTT UNIQUE', foundZipcode);
                checkAlreadyTracking(foundZipcode._id);
                // associateToUser(foundZipcode, userId);
            } else {
                // console.log('ZIPCODE IS UNIQUE', foundZipcode);

            }
        }
    });
}


function checkAlreadyTracking(zipcodeId) {
    console.log(zipcodeId);
    
    User.find({"zipId": zipcodeId}, (error, foundZip) => {
        if(error) {
            console.log('ERROR ON CHECKALREADYTRACKING:', error);
        } else {
            if(foundZip[0]){
                console.log('FOUND ZIP:', foundZip);   
            } else {
                console.log('NOT ALREADY TRACKING'); 
            }
                    
        }
    })
}


function associateToUser(zipToAssociate, userId) {
    User.findByIdAndUpdate(
        { "_id": userId },
        { $push: { zipcode: { zipId: zipToAssociate._id } } },
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



module.exports = router;



