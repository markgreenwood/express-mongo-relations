const express = require('express');
const path = require('path');
const app = express();
// const morgan = require('morgan');

const auth = require('./routes/auth');
const riders = require('./routes/riders');
const teams = require('./routes/teams');

const ensureAuth = require('./auth/ensure-auth')();

// app.use(morgan('dev'));
const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir));

app.use('/api/auth', auth);
app.use('/api/riders', riders);
app.use('/api/teams', ensureAuth, teams);

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const code = err.code || 500;
  const error = (err.code === 500) ? 'Internal server error' : err.error;
  res.status(code).send({ error });
});

module.exports = app;