const express = require('express');
const teams = express.Router();
const Team = require('../models/team');
const Rider = require('../models/rider');
const bodyParser = require('body-parser').json();

teams.get('/', (req, res, next) => {
  const query = {};
  Team.find(query)
    .then((teams) => {
      res.send(teams);
    })
    .catch(next);
});

teams.get('/:id', (req, res, next) => {
  Team.findById(req.params.id)
    .then((team) => {
      if (team) res.send(team);
      else next({ code: 404, error: 'Not found' });
    })
    .catch(next);
});

teams.post('/', bodyParser, (req, res, next) => {
  new Team(req.body).save()
    .then((saved_team) => { res.send(saved_team); })
    .catch(next);
});

teams.put('/:team_id/rider/:rider_id', (req, res, next) => {
  Rider.findByIdAndUpdate(req.params.rider_id, { teamId: req.params.team_id })
    .then((updated_rider) => { res.send(updated_rider); })
    .catch(next);
});

teams.put('/:id', bodyParser, (req, res, next) => {
  Team.findByIdAndUpdate(req.params.id, req.body)
    .then((updated_team) => { res.send(updated_team); })
    .catch(next);
});

teams.delete('/:id', (req, res, next) => {
  Team.findByIdAndRemove(req.params.id)
    .then((removed_team) => { res.send(removed_team); })
    .catch(next);
});

module.exports = teams;