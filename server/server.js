const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();

const passport = require('./strategies/user.strategy');
const sessionConfig = require('./modules/session-middleware');

// DB module
const db = require('./modules/db-config');

// Route includes
const userRouter = require('./routes/user.router');
const databaseRouter = require('./routes/database.router');
const owmapiRouter = require('./routes/owmapi.router');

// Body parser middleware
app.use(bodyParser.json());

// Passport Session Configuration
app.use(sessionConfig);

// Start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/database', databaseRouter);
app.use('/owmapi', owmapiRouter)

// Serve static files
app.use(express.static('server/public'));


const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log('Server ready on port:', port);   
}); 