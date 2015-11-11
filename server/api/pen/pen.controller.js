'use strict';

var _ = require('lodash');
var Pen = require('../models/ziplines.model').Ziplines;
var Tags = require('../models/ziplines.model').Tags;

// Get list of pens
exports.index = function(req, res) {
  Pen.find(function (err, pens) {
    if(err) { return handleError(res, err); }
    Tags.find(function (err, tgs){
      return res.status(200).json([pens,tgs]);
    });
  });
};

// Get a single pen
exports.show = function(req, res) {
  Pen.findById(req.params.id, function (err, pen) {
    if(err) { return handleError(res, err); }
    if(!pen) { return res.status(404).send('Not Found'); }
    return res.json(pen);
  });
};

// Creates a new pen in the DB.
exports.create = function(req, res) {
  Pen.create(req.body, function(err, pen) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(pen);
  });
};

// Updates an existing pen in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Pen.findById(req.params.id, function (err, pen) {
    if (err) { return handleError(res, err); }
    if(!pen) { return res.status(404).send('Not Found'); }
    var updated = _.merge(pen, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(pen);
    });
  });
};

// Deletes a pen from the DB.
exports.destroy = function(req, res) {
  Pen.findById(req.params.id, function (err, pen) {
    if(err) { return handleError(res, err); }
    if(!pen) { return res.status(404).send('Not Found'); }
    pen.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}