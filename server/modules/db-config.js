// Mongoose
const mongoose = require('mongoose');

// MongoDB Name
const databaseName = 'lastWeatherYesterday';

// Mongo connection URI
let mongoURI = '';
// process.env.MONGODB_URI will only be defined if you
// are running on Heroku
if(process.env.MONGODB_URI != undefined){
    // use the value from the environment variable
    mongoURL = process.env.MONGODB_URI;
} else {
    // use the local database
    mongoURI = 'mongodb://localhost:27017/' + databaseName;
}

mongoose.connect(mongoURI);

mongoose.connection.on('error', (error) => {
    if(error){
        console.log('mongoose connection error');
    }
});

mongoose.connection.on('open', () => {
    console.log('mongoose connected to:', mongoURI);    
});


module.exports = mongoose;