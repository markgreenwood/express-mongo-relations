const express = require('express');
const teams = express.Router();
const Team = require('../models/team');
const Rider = require('../models/rider');
const bodyParser = require('body-parser').json();
const ensureAuth = require('../auth/ensure-auth')();
const ensureAdmin = require('../auth/ensure-role')('admin');
const ensureSuperuser = require('../auth/ensure-role')('superuser');

teams.get('/', (req, res, next) => {
  const query = {};
  Team.find(query)
    .then((teams) => {
      res.send(teams);
    })
    .catch(next);
});

teams.get('/:id/riders', (req, res, next) => {
  const teamId = req.params.id;
  Promise.all([
    Team.findById(teamId).lean(),
    Rider
      .find({ teamId })
      .select('name role')
      .lean()
  ])
    .then(([team, riders]) => {
      team.riders = riders;
      res.send(team);
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

teams.post('/', ensureAuth, ensureAdmin, bodyParser, (req, res, next) => {
  new Team(req.body).save()
    .then((saved_team) => { res.send(saved_team); })
    .catch(next);
});

teams.put('/:team_id/rider/:rider_id', ensureAuth, ensureAdmin, (req, res, next) => {
  Rider.findByIdAndUpdate(req.params.rider_id, { teamId: req.params.team_id })
    .then((updated_rider) => { res.send(updated_rider); })
    .catch(next);
});

teams.put('/:id', ensureAuth, ensureAdmin, bodyParser, (req, res, next) => {
  Team.findByIdAndUpdate(req.params.id, req.body)
    .then((updated_team) => { res.send(updated_team); })
    .catch(next);
});

teams.delete('/:id', ensureAuth, ensureSuperuser, (req, res, next) => {
  Team.findByIdAndRemove(req.params.id)
    .then((removed_team) => { res.send(removed_team); })
    .catch(next);
});

module.exports = teams;