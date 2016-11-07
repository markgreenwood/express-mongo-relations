const Team = require('../lib/models/team');
const expect = require('chai').expect;

describe ('team model', () => {

  it ('validates with name and country', (done) => {
    const test_team = new Team({
      team: 'Francaise de Jeux',
      sponsor: 'Francaise de Jeux',
      country: 'France'
    });

    test_team.validate((err) => {
      done(err);
    });
  });

  it ('team is required', (done) => {
    const test_team = new Team({
      sponsor: 'Astana Gaz',
      country: 'Kazakhstan'
    });

    test_team.validate((err) => {
      if (!err) done('team name should have been required');
      expect(err).to.be.ok;
      done();
    });
  });

  it ('country is required', (done) => {
    const test_team = new Team({
      team: 'Astana',
      sponsor: 'Astana Gaz'
    });

    test_team.validate((err) => {
      if (!err) done('country should have been required');
      expect(err).to.be.ok;
      done();
    });
  });

});