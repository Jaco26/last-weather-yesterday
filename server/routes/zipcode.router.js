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
    findZipcode(zipcodeToAdd, userId, res);
});


function findZipcode(zipcodeToAdd, userId, res) {
    // console.log(zipcode);
    Zipcode.find({ "zipcode": zipcodeToAdd.zipcode }, (error, foundZipcode) => {
        if (error) {
            console.log('ERROR ON UNIQUE ZIP TEST', error);
        } else {
            if (foundZipcode[0]) {
                console.log('------------------ ZIPCODE IS NOOOOOOTTTTTT UNIQUE', foundZipcode);
                checkAlreadyTracking(foundZipcode[0], userId, res);
            } else {
                console.log('------------------ ZIPCODE IS UNIQUE', foundZipcode);
                saveZipcode(zipcodeToAdd, userId, res);
            }
        }
    });
}

// IF zipcodeToAdd DOES NOT EXIST in database, save it
// if successful on save, associate to the user who entered it
function saveZipcode (zipcodeToAdd, userId, res) {
    zipcodeToAdd.save((error, savedZipcode) => {
       if (error) {
           console.log('error on post zipcode', error);
           res.sendStatus(500);     
       } else {
           console.log('------------- savedZipcode:', savedZipcode);
           associateToUser(savedZipcode, userId, res);
       }
   });
}

function checkAlreadyTracking(zipcodeToCheck, userId, res) {
    User.find({"_id": userId}, (error, foundUser) => {        
        if(error) {
            console.log('--------------------ERROR ON checkAlreadyTracking:', error);
        } else {
            // console.log('In else of checkAlreadyTracking: FOUND USER:', foundUser);
            let zipIdRe = new RegExp (zipcodeToCheck._id);
            let foundZipcode = foundUser[0].zipcode.filter(item => zipIdRe.test(item.zipId))[0];
            console.log('-------- foundZipcode', foundZipcode);
            if(foundZipcode){
                console.log('------- ALREADY TRACKING:', foundZipcode);   
                res.sendStatus(403); // Forbidden, might not be the best code but...https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403 
            } else {
                console.log('------ NOT ALREADY TRACKING', foundZipcode); 
                associateToUser(zipcodeToCheck, userId, res)
            }   
        }
    });
}

function associateToUser(zipToAssociate, userId, res) {
    console.log('in associateToUser');
    
    User.findByIdAndUpdate(
        { "_id": userId },
        { $push: { zipcode: { zipId: zipToAssociate._id } } },
        (pusherror, doc) => {
            if (pusherror) {
                console.log('------------ error on push zipcode to user.zipcodeDate', pusherror);
                res.sendStatus(500);
            } else {
                console.log('--------------- associated to user!', doc);
                res.sendStatus(201);
            }
        }
    );
}


module.exports = router;



