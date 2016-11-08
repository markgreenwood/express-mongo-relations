const tokenService = require('./token');

module.exports = function makeEnsureAuth() {

  return function ensureAuth(req, res, next) { // eslint-disable-line no-unused-vars
    const authHeader = req.headers.authorization;

    // console.log('Entering ensureAuth');

    if (!authHeader) {
      // console.log('No auth header in ensureAuth');

      return next({
        code: 400,
        error: 'unauthorized, no token provided'
      });
    }

    const [bearer, jwt] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !jwt) {
      // console.log('Bad auth header in ensureAuth');
      
      return next({
        code: 400,
        error: 'unauthorized, invalid token' 
      });
    }

    tokenService.verify(jwt)
      .then((payload) => {
        // console.log('Payload found in ensureAuth');
        
        req.user = payload;
        next();
      })
      .catch((err) => { // eslint-disable-line no-unused-vars
        // console.log('Reached catch block in ensureAuth');
        
        return next({
          code: 403,
          error: 'unauthorized, invalid token'
        });
      });
  };

};