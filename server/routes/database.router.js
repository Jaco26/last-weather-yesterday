const express = require('express');
const router = express();
const mongoose = require('../modules/db-config');
// Models
const User = require('../models/User');
const Zipcode = require('../models/Zipcode');

router.post('/zipcode/:id', (req, res) => {
    let userId = req.params.id;
    let zipcodeToAdd = new Zipcode(req.body);
    zipcodeToAdd.save( (error, savedZipcode) => {
        if(error){
            console.log('error on post zipcode');
            res.sendStatus(500)
        } else {
            console.log('savedZipcode:', savedZipcode);  
            User.findByIdAndUpdate(
                {"_id": userId},
                {$push: {zipcodeDate: {zipcode: savedZipcode._id}}},
                // {$push: {zipcodeDate: {startTrackDate: Date.now}}},
                (pusherror, doc) => {
                    if(pusherror){
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

// router.get('/:id', (req, res) => {
//     User.findById(req.params.id).populate('zipcodes').exec( (error, foundUser) => {
//         if(error) {
//             console.log('Error on find user by id:', error);
//             res.sendStatus(500);            
//         } else {
//             let user = {
//                 username: foundUser.username,
//                 _id: foundUser._id,
//                 zipcodeDate: foundUser.zipcodeDate
//             }
//             res.send(foundUser);
//         }
//     })
// })



module.exports = router;



