'use strict';

var logger  = require('../../../config/logger'),
    model   = require('../../index').sequelize,
    Job     = require('../models/job')(model),
    token   = require('../util/token');

var createjobToken = function() {
  return "job:" + token.createToken()
};

exports.createJob = function(req, res) {

  var data = req.body;
  // send job data and create new entry unless already existing

  Job.create({
      description: data.description,
      type: data.type,
      notes: data.notes,
      assignedBy: data.assignedBy,
      phone: data.phone,
      stops: data.stopsId // associated stops

  }).then(function(job) {
      console.log("Created job:", job);
      res.json(job); 
  }).catch(function(error) {
    console.log("Error creating job:", error);
    res.sendStatus(500);
  });
};

exports.getJob = function(req, res) {
  var id = req.params.id;

  Job.findOne({
    where: { id: id }
  }).then(function(job) {
    if (!job) {
      res.sendStatus(404);
    } else {
      res.status(200).json(job);
    }
  });
};

exports.updateJob = function(req, res) {
  var id 	    = req.params.id,
  	data      = req.body;

  Job.update({
    description: data.description || null,
    type: data.type || null, 
    notes: data.notes || null,
    assignedBy: data.assignedBy || null,
    phone: data.phone || null,
    stops: data.stopsId || null
  }, {
    where: { jobToken: id }
  }).then(function(job) {
    if (!job) {
      res.sendStatus(404);
    } else {
      res.status(200).json(job);
    }
  }).catch(function(error) {
    console.log("Error updating job:", token, error);
    res.sendStatus(500);
  });
};

// Get ALL jobs associated with a company or driver
exports.getJobs = function(req, res) {
  Job.findAll().then(function(jobs) {
    res.status(200).json(jobs);
  }).catch(function(error) {
    console.log("Error receiving the jobs:", error);
    res.sendStatus(500);
  });
};
