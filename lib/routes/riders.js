const express = require('express');
const riders = express.Router();
const Rider = require('../models/rider');
const bodyParser = require('body-parser').json();
const ensureAuth = require('../auth/ensure-auth')();
const ensureAdmin = require('../auth/ensure-role')('admin');
const ensureSuperuser = require('../auth/ensure-role')('superuser');

riders.get('/', (req, res, next) => {
  // console.log('Starting GET /api/riders request');
  let query = {};
  if (req.query) query = req.query;
  Rider.find(query)
    .populate({
      path: 'teamId',
      select: 'team'
    })
    .lean()
    .then((riders) => {
      // console.log('Sending response to GET /api/riders');
      res.send(riders);
    })
    .catch((err) => {
      // console.log('Got into catch block for GET /api/riders');
      next(err);
    });
});

riders.get('/avgHeight', (req, res, next) => {
  let criteria = {};
  if (req.query) {
    criteria = { $match: req.query };
  }
  Rider.aggregate(criteria, { $group: { _id: 0, avgHeight: { $avg: '$height'}}}, { $project: { _id: 0, avgHeight: 1 }})
    .then((results) => {
      res.send(results[0]);
    })
    .catch(next);
});

riders.get('/avgWeight', (req, res, next) => {
  let criteria = {};
  if (req.query) {
    criteria = { $match: req.query };
  }
  Rider.aggregate(criteria, { $group: { _id: 0, avgWeight: { $avg: '$weight'}}}, { $project: { _id: 0, avgWeight: 1 }})
    .then((results) => {
      res.send(results[0]);
    })
    .catch(next);
});

riders.get('/:id', (req, res, next) => {
  Rider.findById(req.params.id)
    .populate({
      path: 'teamId',
      select: 'team'
    })
    .lean()
    .then((rider) => {
      if (rider) res.send(rider);
      else next({ code: 404, error: 'Not found' });
    })
    .catch(next);
});

riders.post('/', ensureAuth, ensureAdmin, bodyParser, (req, res, next) => {
  new Rider(req.body).save()
    .then((saved_rider) => { res.send(saved_rider); })
    .catch(next);
});

riders.put('/:id', ensureAuth, ensureAdmin, bodyParser, (req, res, next) => {
  Rider.findByIdAndUpdate(req.params.id, req.body)
    .then((updated_rider) => { res.send(updated_rider); })
    .catch(next);
});

riders.delete('/:id', ensureAuth, ensureSuperuser, (req, res, next) => {
  Rider.findByIdAndRemove(req.params.id)
    .then((removed_rider) => { res.send(removed_rider); })
    .catch(next);
});

module.exports = riders;