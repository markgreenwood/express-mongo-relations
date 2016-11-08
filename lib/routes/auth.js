const router = require('express').Router();
const jsonParser = require('body-parser').json();
const User = require('../models/User');
const token = require('../auth/token');
const ensureAuth = require('../auth/ensure-auth')();

router.post('/validate', ensureAuth, (req, res, next) => { // eslint-disable-line no-unused-vars
  res.send({valid: true});
});

router.post('/register', jsonParser, (req, res, next) => {
  const { username, password } = req.body;
  delete req.body.password;

  // console.log('POST /api/auth/register user info ', username, ':', password);

  if (!username || !password) {
    return next({ code: 400, error: 'username and password must be supplied'});
  }

  // console.log('Looking for ', username, ' in database');
  User.find({ username })
    .count()
    .then((count) => {
      // console.log('Username count ', count);
      if (count > 0) throw { code: 400, error: `username ${username} already exists`};
      // console.log('Making new user with req.body ', req.body);
      const user = new User(req.body);
      user.generateHash(password);
      // console.log('Made new user ', user);
      return user.save();
    })
    .then((user) => { return token.sign(user); })
    .then((token) => { res.send({ token }); })
    .catch(next);
});

router.post('/signin', jsonParser, (req, res, next) => {
  const { username, password } = req.body;
  delete req.body.password;

  User.findOne({ username })
    .then((user) => {
      if (!user || !user.compareHash(password)) {
        throw { code: 400, error: 'invalid username or password' };
      }
      return token.sign(user);
    })
    .then((token) => res.send({ token }))
    .catch(next);
});

module.exports = router;