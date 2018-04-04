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

router.get('/', (req, res) => {
    let oneWeekAgo = new Date(moment().subtract(7, 'days'));
    let today = new Date(moment());
    console.log('oneWeekAgo ---- - - -', oneWeekAgo);
    console.log('today ==== ---- - - -', today);
    Zipcode.aggregate([
        // {"zipcode": /55404/},
        // {"weather.dt": {$gt: oneWeekAgo}},
        {"$unwind": "$weather"},
        { "$match": { "$and": [{ "weather.dt": { "$gte": oneWeekAgo } }, { "zipcode": /55404/ }] } }]).limit(10).exec(

        // { weather: 
        //     {$elemMatch: { dt: { $gte: oneWeekAgo, $lte: today } } } },
        (err, response) => {
            if (err) {
                console.log(err);

            } else {
                console.log(response);
                console.log(response[0].weather[0].dt);
                console.log(response[0].weather[0]);
                
                // res.send(response)
            }
        }
    )
})

// router.get('/ingredients/', function (req, res) {
//     var ingredientName = req.params.name;
//     // Limit to 20 results
//     // Execute the query
//     Recipes.aggregate([
//         { "$unwind": "$ingredients" }, // Flattens the array of ingredients to allow for grouping
//         {
//             "$group": { // Re-group by ingredient name
//                 "_id": "$ingredients.name", // Group by
//                 "count": { "$sum": 1 } // Add one for each occurrence
//             }
//         },
//     ]).limit(20).exec(function (err, foundRecipes) {
//         if (err) {
//             console.log(err);
//             res.sendStatus(500);
//         } else {
//             res.send(foundRecipes);
//         }
//     });
// });




// db.inventory.find({
//     qty: {
//         $all: [
//             { "$elemMatch": { size: "M", num: { $gt: 50 } } },
//             { "$elemMatch": { num: 100, color: "green" } }
//         ]
//     }
// })


module.exports = router;

