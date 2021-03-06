const express = require('express');
const encryptLib = require('../modules/encryption');
const userStrategy = require('../strategies/user.strategy');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
// Models
const User = require('../models/User');
const Zipcode = require('../models/Zipcode');
const Comment = require('../models/Comments');

// database zipcode submission validation module
const findZipcode = require('../modules/validate-zip-submissions');

const owmapiSearchByZip = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const owmapiKey = process.env.OWMAPI_KEY;

let verbose = false; // used to show explanations for learning
// Handles Ajax request for user information if user is authenticated
router.get('/', (req, res) => {
    // check if logged in
    if (req.isAuthenticated()) {
        // send back user object from database
        if (verbose) {
            console.log('req.isAuthenticated() true');
            console.log('returning user:', req.user);
        }
        let userInfo = {
            username: req.user.username,
            _id: req.user._id,
            zipcode: req.user.zipcode,
            comments: req.user.comments,
            photos: req.user.photos,
        }; 
        res.send({ userInfo: userInfo });
    } else {
        // failure best handled on the server. do redirect here.
        if (verbose) console.log('req.isAuthenticated() false');
        res.sendStatus(403);
    }
});


// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
    const newZip = new Zipcode(req.body.firstZipcode);
    const username = req.body.username;
    if (verbose) console.log('attempting to create req.body:', req.body);
    const password = encryptLib.encryptPassword(req.body.password);
    if (verbose) console.log('encryptLib.encryptPassword(req.body.password) is ', password);
    const newUser = new User({ username, password });
    newUser.zipcode.isPrimary = true;
    newUser.save()
        .then(() => {
            if (verbose) console.log('new user saved:', newUser);
            findUserByUsername(username, newZip, res);
            // res.sendStatus(201);
        })
        .catch((err) => { next(err); });
});

function findUserByUsername(username, zipToSave, res) {
    // let userId;
    User.find({ "username": username }, (error, foundUser) => {
        if (error) {
            console.log('ERROR', error);
        } else {
            let userId = foundUser[0]._id;
            findZipcode(zipToSave, userId, res);
        }
    }); // END User.find
} // END findUserByUsername


// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
    if (verbose) console.log('logging in, req.body:', req.body);
    res.sendStatus(200);
});

// clear all server session information about this user
router.get('/logout', (req, res) => {
    // Use passport's built-in method to log out the user
    req.logout();
    res.sendStatus(200);
});


module.exports = router;
