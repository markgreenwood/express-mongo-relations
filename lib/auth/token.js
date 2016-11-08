const jwt = require('jsonwebtoken');
const secretKey = process.env.APP_SECRET_KEY || 'appsecretkey';

module.exports = {
  sign(user) {
    // console.log('token.sign() with user ', user);
    return new Promise((resolve, reject) => {
      const payload = {
        id: user._id,
        roles: user.roles
      };
      
      jwt.sign(payload, secretKey, null, (err, token) => {
        if (err) return reject(err);
        resolve(token);
      });
    });
  },
  verify(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, payload) => {
        if (err) return reject(err);
        resolve(payload);
      });
    });
  }
};