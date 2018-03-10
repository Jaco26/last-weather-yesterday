const express = require('express');
const encryptLib = require('../modules/encryption');
const User = require('../models/User');
const userStrategy = require('../strategies/user.strategy');
const router = express.Router();

let verbose = true; // used to show explanations for learning
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
            zipcodeDate: req.user.zipcodeDate
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
    const username = req.body.username;
    if (verbose) console.log('attempting to create req.body:', req.body);
    const password = encryptLib.encryptPassword(req.body.password);
    if (verbose) console.log('encryptLib.encryptPassword(req.body.password) is ', password);
    const newUser = new User({ username, password });
    newUser.save()
        .then(() => {
            if (verbose) console.log('new user saved:', newUser);
            res.sendStatus(201);
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

module.exports = router;
