const express = require('express');
const app = express();
// const morgan = require('morgan');

const riders = require('./routes/riders');
const teams = require('./routes/teams');

// app.use(morgan('dev'));
app.use('/api/riders', riders);
app.use('/api/teams', teams);

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const code = err.code || 500;
  const error = (err.code === 500) ? 'Internal server error' : err.error;
  res.status(code).send(error);
});

module.exports = app;