const Rider = require('../lib/models/rider');
const expect = require('chai').expect;

describe ('rider model', () => {

  it ('validates with name and team', (done) => {
    const test_rider = new Rider({
      name: 'Marco Velo',
      team: 'Francaise de Jeux',
      nationality: 'Italian'
    });

    test_rider.validate((err) => {
      done(err);
    });
  });

  it ('name is required', (done) => {
    const test_rider = new Rider({
      team: 'Astana',
      nationality: 'German'
    });

    test_rider.validate((err) => {
      if (!err) done('rider name should have been required');
      expect(err).to.be.ok;
      done();
    });
  });

  it ('role defaults to domestique', (done) => {
    const test_rider = new Rider({
      name: 'Alexander Vinokourov',
      team: 'Astana',
      nationality: 'Kazakh'
    });

    test_rider.validate((err) => {
      if (err) done(err);
      else {
        expect(test_rider.role).to.be.equal('domestique');
        done();
      }
    });
  });

});