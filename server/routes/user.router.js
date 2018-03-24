const express = require('express');
const encryptLib = require('../modules/encryption');
const User = require('../models/User');
const Zipcode = require('../models/Zipcode')
const userStrategy = require('../strategies/user.strategy');
const router = express.Router();
const axios = require('axios');

const owmapiSearchByZip = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const units = '&units=imperial';
const owmapiKey = process.env.OWMAPI_KEY;

let verbose = false; // used to show explanations for learning
// Handles Ajax request for user information if user is authenticated
router.get('/', (req, res) => {
    // let userIsLoaded = req.params.userIsLoaded;
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
        // if(!userIsLoaded){
        //     console.log('----------- CALLING OWMAPI');
        //     let primaryZipObj = userInfo.zipcode.filter(zip => zip.isPrimary);
        //     getWeatherForPrimaryZip(primaryZipObj[0].zipId, res, userInfo);
        // // }
        res.send({ userInfo: userInfo });
    } else {
        // failure best handled on the server. do redirect here.
        if (verbose) console.log('req.isAuthenticated() false');
        res.sendStatus(403);
    }
});

function getWeatherForPrimaryZip(zipId, res, userInfo) {
    Zipcode.findById({ "_id": zipId }).populate('users').exec((error, foundZipcode) => {
        if (error) {
            console.log('Error on find', error);
        } else {
            console.log('foundZipcode.zipcode:', foundZipcode.zipcode);
            axios.get(owmapiSearchByZip + foundZipcode.zipcode + owmapiKey + units)
                .then(response => {
                    let currentWeather = response.data;
                    console.log('CURRENT WEATHER!!!!', currentWeather);
                    res.send({ currentWeather: currentWeather, userInfo: userInfo })
                }).catch(error => {
                    console.log('Error', error);
                }); // END axios.get
        }
    }); // END Zipcode.findById
}


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
function saveZipcode(zipcodeToAdd, userId, res) {
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
    User.find({ "_id": userId }, (error, foundUser) => {
        if (error) {
            console.log('--------------------ERROR ON checkAlreadyTracking:', error);
        } else {
            // console.log('In else of checkAlreadyTracking: FOUND USER:', foundUser);
            let zipIdRe = new RegExp(zipcodeToCheck._id);
            let foundZipcode = foundUser[0].zipcode.filter(item => zipIdRe.test(item.zipId))[0];
            console.log('-------- foundZipcode', foundZipcode);
            if (foundZipcode) {
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



// function saveZipcode (zipToSave, userId, res) {
//     zipToSave.save((error, savedZipcode) => {
//         if (error) {
//             console.log('ERROR on newZip.save in POST /register', error);
//             res.sendStatus(500);
//         } else {
//             let primary = true;
//             User.findByIdAndUpdate(
//                 { "_id": userId },
//                 { $push: { zipcode: { zipId: savedZipcode._id, isPrimary: true } } },
//                 (pusherror, doc) => {
//                     if (pusherror) {
//                         console.log('error on push zipcode to user.zipcodeDate', pusherror);
//                         res.sendStatus(500);
//                     } else {
//                         res.sendStatus(201);
//                     }
//                 }
//             );
//         }
//     }); // END zipToSave.save
// } // END saveZipcode







module.exports = router;
