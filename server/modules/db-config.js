// Mongoose
const mongoose = require('mongoose');

// MongoDB Name
const databaseName = 'weatherHistory';

// Mongo connection URI
let mongoURI = '';

if(process.env.MONGODB_URI != undefined){
    // use the value from the environment variable
    mongoURL = process.env.MONGODB_URI;
} else {
    // use the local database
    mongoURI = 'mongodb://localhost:27017/' + databaseName;
}

mongoose.connection.on('connected', () => {
    console.log('mongoose connected to:', mongoURI);    
});
mongoose.connection.on('error', () => {
    console.log('mongoose connection error');    
});
mongoose.connect(mongoURI); // connect to the database!

module.exports = mongoose;