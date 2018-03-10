const express = require('express');
const app = express();
const port = process.env.PORT || 5001;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Routers
// const databaseRouter = require('./routes/database-route');
// app.use('/database', databaseRouter);

app.use(express.static('server/public'));
app.listen(port, () => {
    console.log('Server ready on port:', port);    
}); 