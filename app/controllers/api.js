/**
 *  All API controllers -- Drivers, Jobs, Organizations, Routes, etc etc
*/

'use strict'; 

var logger      = require('../../config/logger'),
    model       = require('../../app').sequelize,
    Driver      = require('../models/Driver')(model);

//To Do -- Send twilio text with download link to new driver

/**
 *  Driver controllers
*/

exports.createDriver = function(req, res) {
  //TODO sanitize request with express validator
  req.assert('firstName', 'First Name cannot be blank').notEmpty();
  req.assert('lastName', 'Last Name cannot be blank').notEmpty();
  req.assert('phone', 'Password cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    res.json({ msg: errors });
    return logger.error(errors);
  }

  // send driver data and create new entry unless already existing

  Driver.findOrCreate({ 
    where: {
    phone: req.body.phone,
    firstName: req.body.firstName,
    lastName: req.body.lastName
    } 
  }).spread(function(driver, created) {
    if (!created) { res.json({ "msg": 'Driver already exists' }); }
      else { res.json(driver); } // new driver created data
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

// Get ALL drivers associated with an organization
exports.getDrivers = function(req, res) {
  Driver.findAll({}).then(function(err, drivers) {
    res.status(200).json(drivers);
  });
};

// get specified driver information and filter
// if no id parameter provided, show all drivers

// to do 
// authentication
// query filtering

