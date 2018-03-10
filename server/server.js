const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const passport = require('./strategies/user.strategy');
const sessionConfig = require('./modules/session-middleware');

// DB module
const db = require('./modules/db-config');

// Route includes
const userRouter = require('./routes/user.router');
const databaseRouter = require('./routes/database.router')

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

// Serve static files
app.use(express.static('server/public'));

const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log('Server ready on port:', port);    
}); 