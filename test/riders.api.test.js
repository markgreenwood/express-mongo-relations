const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');
const app = require('../lib/app');

describe ('riders API E2E tesing', () => {

  const test_riders = [
    {
      name: 'George Hincapie',
      team: 'HTC',
      role: 'leader',
      nationality: 'American',
      height: 185,
      weight: 81
    },
    {
      name: 'Jan Ullrich',
      team: 'Deutsche Telekom',
      role: 'GC',
      nationality: 'German',
      height: 183,
      weight: 80
    },
    {
      name: 'Jens Voigt',
      team: 'Trek',
      role: 'roleur',
      nationality: 'German',
      height: 178,
      weight: 78
    },
    {
      name: 'Mark Cavendish',
      team: 'HTC',
      role: 'sprinter',
      nationality: 'Manx',
      height: 170,
      weight: 64
    },
    {
      name: 'Bradley Wiggins',
      team: 'Sky',
      height: 165,
      weight: 55,
      nationality: 'English',
      role: 'climber'
    },
    {
      name: 'David Etxabarria',
      team: 'Euskaltel',
      role: 'climber',
      nationality: 'Basque',
      height: 167,
      weight: 57
    },
    {
      name: 'Cadel Evans',
      team: 'Sky',
      height: 167,
      weight: 59,
      nationality: 'Australian',
      role: 'climber'
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

  // it ('POST a rider stores the data and returns the stored object', (done) => {

  //   request
  //     .post('/api/riders')
  //     .send(test_riders[0])
  //     .then((res) => {
  //       const rider = res.body;
  //       expect(rider._id).to.be.ok;
  //       test_riders[0].__v = 0;
  //       test_riders[0]._id = rider._id;
  //       done();
  //     })
  //     .catch(done);

  // });

  it ('POSTs a bunch of riders', (done) => {
    Promise.all(
      test_riders.map((rider) => { return request.post('/api/riders').send(rider); })
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

  it ('GET /:id returns the correct rider', (done) => {

    request
      .get(`/api/riders/${test_riders[0]._id}`)
      .then((res) => {
        expect(res.body).to.deep.equal(test_riders[0]);
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

  it ('returns only riders who are GC', (done) => {
    request
      .get('/api/riders')
      .query({ role: 'GC' })
      .then((res) => {
        const first_rtnd = res.body[0];
        expect(first_rtnd.name).to.deep.equal('Jan Ullrich');
        done();
      })
      .catch(done);
  });

  it ('updates specific rider info given id', (done) => {
    request
      .put(`/api/riders/${test_riders[1]._id}`)
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

  it ('deletes specific rider given id', (done) => {
    request
      .delete(`/api/riders/${test_riders[1]._id}`)
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

  // after((done) => {
  //   connection.close(done);
  // });

});