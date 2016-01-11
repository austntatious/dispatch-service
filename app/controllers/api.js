/**
 *  All API controllers -- Drivers, Jobs, Organizations, Routes, etc etc
*/

'use strict'; 

var _     = require('lodash'), 

// Load mongoose models and config
  Driver  = require('../models/Driver'),
  Job     = require('../models/Job');


//To Do -- Send twilio text with download link to new driver

/**
 *  Driver controllers
*/

exports.createDriver = function(req, res) {
  //TODO sanitize request with express validator
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('phone', 'Password cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    res.json({msg: errors});
    return console.log(errors);
  }

  var driver = new Driver({
    phone: req.body.phone,
    name: req.body.name
  });

  Driver.findOne({ phone: req.body.phone }, function(err, existingUser) {
    if (existingUser) {
      return res.json({ msg: 'Driver already exists' });
    }
    driver.save(function(err) {
      if (err) { return next(err); }
      res.status(200).json(driver);
    });
  });
};

exports.getDriverInfo = function(req, res) {
  Driver.findById(req.params.id, function(err, driver) {
    if (err) { return err; }
    res.status(200).json(driver);
  });
};

exports.updateDriverInfo = function(req, res) { 
    var newLocation = req.body.location;
    var statusUpdate = req.body.active;
  Driver.findById(req.params.id, function(err, driver) {
    //To Do : add logic for different request bodies
    if (err) { return err; }
    if (newLocation) {
      for(var i = 0; i < newLocation.length; i++) {
        driver.location[i] = newLocation[i];
      }
    }
    if (statusUpdate) {
      driver.active = statusUpdate;
    }  
    res.status(201).json(driver);
  });
};

exports.getDrivers = function(req, res) {
  Driver.find({}, function(err, drivers) {
    res.status(200).json(drivers);
  });
};

//get specified driver information and filter
//if no id parameter provided, show all drivers

//to do 
//authentication
//query filtering

