const express = require('express');
const riders = express.Router();
const Rider = require('../models/rider');
const bodyParser = require('body-parser').json();

riders.get('/', (req, res, next) => {
  const query = {};
  if (req.query.role) query.role = req.query.role;
  Rider.find(query)
    .then((riders) => {
      res.send(riders);
    })
    .catch(next);
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

riders.get('/:id', (req, res, next) => {
  Rider.findById(req.params.id)
    .then((rider) => {
      if (rider) res.send(rider);
      else next({ code: 404, error: 'Not found' });
    })
    .catch(next);
});

riders.post('/', bodyParser, (req, res, next) => {
  new Rider(req.body).save()
    .then((saved_rider) => { res.send(saved_rider); })
    .catch(next);
});

riders.put('/:id', bodyParser, (req, res, next) => {
  Rider.findByIdAndUpdate(req.params.id, req.body)
    .then((updated_rider) => { res.send(updated_rider); })
    .catch(next);
});

riders.delete('/:id', (req, res, next) => {
  Rider.findByIdAndRemove(req.params.id)
    .then((removed_rider) => { res.send(removed_rider); })
    .catch(next);
});

module.exports = riders;