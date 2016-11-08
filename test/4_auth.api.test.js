const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');
const app = require('../lib/app');

describe( 'auth', () => {

  before((done) => {
    const CONNECTED = 1;
    if (connection.readyState === CONNECTED) dropCollection();
    else connection.on('open', dropCollection);

    function dropCollection() {
      const name = 'users';
      connection.db
        .listCollections({ name })
        .next((err, collInfo) => {
          if (!collInfo) return done();
          connection.db.dropCollection(name, done);
        });
    }
  });

  const request = chai.request(app);

  describe ('unauthorized', () => {

    it ('400 with no token', (done) => {
      // console.log('Entering unauthorized test');
      request
        .get('/api/riders')
        .then((res) => { // eslint-disable-line no-unused-vars
          // console.log('Entering first then block with res ', res);
          done('status should not be 200');
        })
        .catch((err) => {
          // console.log('Entering first catch block');
          expect(err.response.status).to.equal(400);
          expect(err.response.body.error).to.equal('unauthorized, no token provided');
          done();
        })
        .catch((err) => {
          // console.log('Entering second catch block');
          done(err);
        });
    });

    it ('403 with invalid token', (done) => {
      // console.log('Entering unauthorized test');
      request
        .get('/api/riders')
        .set('Authorization', 'Bearer badtoken')
        .then((res) => { // eslint-disable-line no-unused-vars
          // console.log('Entering first then block with res ', res);
          done('status should not be 200');
        })
        .catch((err) => {
          // console.log('Entering first catch block');
          expect(err.response.status).to.equal(403);
          expect(err.response.body.error).to.equal('unauthorized, invalid token');
          done();
        })
        .catch((err) => {
          // console.log('Entering second catch block');
          done(err);
        });
    });

  });

  describe ('user management', () => {

    function badRequest(url, send, error, done) {
      request
        .post(url)
        .send(send)
        .then(() => {
          done('status should not be 200');
        })
        .catch((err) => {
          expect(err).to.have.status(400);
          expect(err.response.body.error).to.equal(error);
          done();
        })
        .catch(done);
    }

    it ('register requires username', (done) => {
      badRequest('/api/auth/register', { password: 'multipass' }, 'username and password must be supplied', done);
    });

    it ('register requires password', (done) => {
      badRequest('/api/auth/register', { username: 'leeloo' }, 'username and password must be supplied', done);
    });

    let token = ''; // eslint-disable-line no-unused-vars
    const user = {
      username: 'leeloo',
      password: 'multipass'
    };

    it ('register', (done) => {
      request
        .post('/api/auth/register')
        .send(user)
        .then((res) => {
          expect(token = res.body.token).to.be.ok;
          done();
        })
        .catch(done);
    });

    it ('can\'t use same username', (done) => {
      badRequest('/api/auth/register', user, 'username leeloo already exists', done);
    });

    it ('token is valid', (done) => {
      request
        .get('/api/riders')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res.body).to.be.ok;
          done();
        })
        .catch(done);
    });

    it ('signin', (done) => {
      request
        .post('/api/auth/signin')
        .send(user)
        .then((res) => {
          expect(res.body.token).to.equal(token);
          done();
        })
        .catch(done);
    });

  });

});