const express = require('express');
const router = express();
const mongoose = require('../modules/db-config');
// Models
const User = require('../models/User');
const Zipcode = require('../models/Zipcode');

router.post('/zipcode', (req, res) => {
    let zipcodeToAdd = new Zipcode(req.body);
    zipcodeToAdd.save( (error, savedZipcode) => {
        if(error){
            console.log('error on post zipcode');
            res.sendStatus(500)
        } else {
            console.log('savedZipcode:', savedZipcode);
            
            res.sendStatus(201);
        }
    })
})



module.exports = router;



