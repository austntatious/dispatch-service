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
  req.assert('phone', 'Phone cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    res.json({ msg: errors });
    return logger.error(errors);
  }

  // send driver data and create new entry unless already existing

  Driver.findOrCreate({
    where: { phone: req.body.phone },
    defaults: { 
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }
  }).spread(function(driver, created) {
    if (!created) { 
      res.json({ msg: 'Driver already exists' }); 
    } else { 
      res.json(driver); 
    } // new driver created data
  });
};

exports.getDriverInfo = function(req, res) {
  Driver.findById(req.params.id, function(err, driver) {
    if (err) { return err; }
    res.status(200).json(driver);
  });
};

exports.updateDriverInfo = function(req, res) {
  // var newLocation = req.body.location;
  // var active = req.body.active;

  // Project.find({ where: {driverToken: req.params.id} }).on('success', function(driver) {
  //   if (driver) {
  //     if (newLocation) {
  //       driver.updateAttributes({
  //         locationLatitude: newLocation[0],
  //         locationLongitude: newLocation[1],
  //         locationUpdatedAt: Date.now(),
  //         onDuty: req.body.active
  //       }).success(function() {});
  //     }

  //     if (active) {
  //       driver.updateAttributes({
  //         onDuty: req.body.active
  //       }).success(function() {});   
  //     }
  //   }
  // });
};

// Get ALL drivers associated with an organization
exports.getDrivers = function(req, res) {
  // Driver.findAll({}).then(function(err, drivers) {
  //   res.status(200).json(drivers);
  // });
};

// get specified driver information and filter
// if no id parameter provided, show all drivers

// to do 
// authentication
// query filtering

