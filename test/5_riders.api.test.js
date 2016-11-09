const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
chai.should();
chai.use(require('chai-things'));

const connection = require('../lib/setup-mongoose');
const app = require('../lib/app');

describe ('riders API E2E tesing', () => {

  const test_riders = [
    {
      name: 'George Hincapie',
      role: 'leader',
      nationality: 'American',
      height: 185,
      weight: 81
    },
    {
      name: 'Jan Ullrich',
      role: 'GC',
      nationality: 'German',
      height: 183,
      weight: 80
    },
    {
      name: 'Jens Voigt',
      role: 'roleur',
      nationality: 'German',
      height: 178,
      weight: 78
    },
    {
      name: 'Mark Cavendish',
      role: 'sprinter',
      nationality: 'Manx',
      height: 170,
      weight: 64
    },
    {
      name: 'Bradley Wiggins',
      height: 165,
      weight: 55,
      nationality: 'English',
      role: 'climber'
    },
    {
      name: 'David Etxabarria',
      role: 'climber',
      nationality: 'Basque',
      height: 167,
      weight: 57
    },
    {
      name: 'Cadel Evans',
      height: 167,
      weight: 59,
      nationality: 'Australian',
      role: 'climber'
    },
    {
      name: 'Mark Renshaw',
      height: 178,
      weight: 73,
      nationality: 'Australian',
      role: 'leadout'
    }
  ];

  before((done) => {
    const CONNECTED = 1;
    if (connection.readyState === CONNECTED) dropCollection();
    else connection.on('open', dropCollection);

    function dropCollection() {
      const name = 'riders';
      connection.db
        .listCollections({ name })
        .next((err, collInfo) => {
          if (!collInfo) return done();
          connection.db.dropCollection(name, done);
        });
    }
  });

  const request = chai.request(app);

  it ('GET / should return empty array', () => {
    request 
      .get('/api/riders')
      .then((res) => {
        expect(res.body).to.deep.equal([]);
      });
  });

  it ('POST /api/riders without admin privilege should fail', (done) => {
    request
      .post('/api/riders')
      .send({ name: 'Fred Phred', nationality: 'French' })
      .then(() => {
        done('Shouldn\'t be able to POST without "admin" privilege');
      })
      .catch((err) => {
        expect(err).to.have.status(400);
        done();
      });
  });

  const adminUser = {
    username: 'adminuser',
    password: 'multipass',
    roles: ['admin']
  };

  let token = ''; // eslint-disable-line no-unused-vars

  it ('creates an admin user', (done) => {
    request
      .post('/api/auth/register')
      .send(adminUser)
      .then((res) => {
        token = res.body.token;
        done();
      })
      .catch(done);
  });

  it ('POSTs a bunch of riders', (done) => {
    Promise.all(
      test_riders.map((rider) => { 
        return request.post('/api/riders').set('Authorization', `Bearer ${token}`).send(rider);
      })
    )
    .then((results) => {
      results.forEach((item, index) => {
        test_riders[index]._id = item.body._id;
        test_riders[index].__v = 0;
      });
      done();
    })
    .catch(done);
  });

  it ('GET / returns all riders after POST', (done) => {

    request
      .get('/api/riders/')
      .then((res) => {
        expect(res.body).to.deep.equal(test_riders);
        done();
      })
      .catch(done);
  });

  it ('GET /:id returns the correct rider', (done) => {

    request
      .get(`/api/riders/${test_riders[0]._id}`)
      .then((res) => {
        expect(res.body).to.deep.equal(test_riders[0]);
        done();
      })
      .catch(done);
  });

  it ('GET /api/riders?role=GC returns only riders who are GC', (done) => {
    request
      .get('/api/riders')
      .query({ role: 'GC' })
      .then((res) => {
        const roles = res.body.map((rider) => { return rider.role; });
        roles.should.all.equal('GC');
        done();
      })
      .catch(done);
  });

  it ('GET /api/riders?nationality=German returns only riders who are German', (done) => {
    request
      .get('/api/riders')
      .query({ nationality: 'German' })
      .then((res) => {
        const nationalities = res.body.map((rider) => { return rider.nationality; });
        nationalities.should.all.equal('German');
        done();
      })
      .catch(done);
  });

  it ('PUT /api/riders/:id with info object updates specific rider info given id', (done) => {
    request
      .put(`/api/riders/${test_riders[1]._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ weight: 90 })
      .then(() => {
        request
          .get(`/api/riders/${test_riders[1]._id}`)
          .then((res) => {
            expect(res.body.weight).to.equal(90);
            done();
          })
          .catch(done);
      })
      .catch(done);
  });

  it ('DELETE /api/riders/:id without "superuser" privilege should fail', (done) => {
    request
      .delete(`/api/riders/${test_riders[1]._id}`)
      .set('Authorization', `Bearer ${token}`)
      .then(() => {
        done('Shouldn\'t be able to DELETE without "superuser" privilege');
      })
      .catch((err) => {
        expect(err).to.have.status(400);
        done();
      });
  });

  const superUser = {
    username: 'superuser',
    password: 'supersecretpassword',
    roles: ['admin', 'superuser']
  };

  it ('creates a super user', (done) => {
    request
      .post('/api/auth/register')
      .send(superUser)
      .then((res) => {
        token = res.body.token;
        done();
      })
      .catch(done);
  });

  it ('DELETE /api/riders/:id deletes specific rider given id', (done) => {
    request
      .delete(`/api/riders/${test_riders[1]._id}`)
      .set('Authorization', `Bearer ${token}`)
      .then(() => {
        request
          .get(`/api/riders/${test_riders[1]._id}`)
          .then((res) => { // eslint-disable-line no-unused-vars
            done('Should have generated a 404 error');
          })
          .catch((err) => {
            expect(err.response.status).to.equal(404);
            done();
          });
      })
      .catch(done);
  });

  it ('GET /api/riders/avgHeight returns average height of riders', (done) => {
    request
      .get('/api/riders/avgHeight')
      .then((res) => {
        expect(res.body.avgHeight).to.be.a('number');
        expect(res.body.avgHeight).to.be.within(50,200);
        done();
      })
      .catch(done);
  });

  it ('GET /api/riders/avgHeight?role=climber makes sure climbers are really short', (done) => {
    request
      .get('/api/riders/avgHeight')
      .query({ role: 'climber' })
      .then((res) => {
        expect(res.body.avgHeight).to.be.below(175);
        done();
      })
      .catch(done);
  });

  it ('GET /api/riders/avgWeight returns average weight of riders', (done) => {
    request
      .get('/api/riders/avgWeight')
      .then((res) => {
        expect(res.body.avgWeight).to.be.a('number');
        expect(res.body.avgWeight).to.be.within(40,90);
        done();
      })
      .catch(done);
  });

  it ('GET /api/riders/avgWeight?role=climber makes sure climbers are really light', (done) => {
    request
      .get('/api/riders/avgWeight')
      .query({ role: 'climber' })
      .then((res) => {
        expect(res.body.avgWeight).to.be.below(65);
        done();
      })
      .catch(done);
  });

  // after((done) => {
  //   connection.close(done);
  // });

});