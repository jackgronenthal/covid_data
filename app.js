const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const util = require('./util');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

const nyt = require('./routes/nyt');
const input = require('./routes/index');

util.initialize_data()
app.use('/nyt', nyt.router);
app.use('/input', input);


app.use((request, response, next) => {
    const error = new Error('Server working');
    error.status = 404;
    next(error);
})

module.exports = app;