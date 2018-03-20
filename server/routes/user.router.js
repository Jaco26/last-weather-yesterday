const express = require('express');
const encryptLib = require('../modules/encryption');
const User = require('../models/User');
const Zipcode = require('../models/Zipcode')
const userStrategy = require('../strategies/user.strategy');
const router = express.Router();

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
        }
        res.send(userInfo);
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
    newUser.save()
        .then(() => {
            if (verbose) console.log('new user saved:', newUser);
            findUserByUsername(username, newZip, res);
            // res.sendStatus(201);
        })
        .catch((err) => { next(err); });
});

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




function findUserByUsername (username, zipToSave, res) {
    console.log('username', username);
    
    let userId
    User.find({ "username": username }, (error, foundUser) => {
        if (error) {
            console.log('ERROR', error);
        } else {
            userId = foundUser[0]._id;
            saveZipcode(zipToSave, userId, res);
        }
    });
}

function saveZipcode (zipToSave, userId, res) {
    zipToSave.save((error, savedZipcode) => {
        if (error) {
            console.log('ERROR on newZip.save in POST /register', error);
            res.sendStatus(500);
        } else {
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
            // res.sendStatus(200);
            console.log('YAYYY');
            // User.find({"username": username}, (error, foundUser))
        }
    })
}




module.exports = router;
