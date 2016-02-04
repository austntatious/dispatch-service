/**
 *  All API controllers -- Drivers, Jobs, Companies, Routes, etc etc
*/

'use strict'; 

var logger = require('../../config/logger'),
    model  = require('../../app').sequelize,
    Driver = require('../models/driver')(model),
    token   = require('../util/token');


var DEFAULT_LATITUDE = 40.7392534
var DEFAULT_LONGITUDE = -74.0030267

//To Do -- Send twilio text with download link to new driver

var createDriverToken = function() {
  return "driver:" + token.createToken()
};

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
    where: { 
      phone: req.body.phone 
    },
    defaults: { 
      driverToken: createDriverToken(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      //TODO(austin): link to account token from current session.
      accountToken: "account:fake_token",
      onDuty: false,
      locationLatitude: DEFAULT_LATITUDE,
      locationLongitude: DEFAULT_LONGITUDE,
      locationUpdatedAt: Date.now()
    }
  }).spread(function(driver, created) {
    if (!created) {
      console.log("Driver with phone number", req.body.phone, "already exists.");
      res.json({ msg: 'Driver already exists' }); 
    } else {
      console.log("Created driver:", driver);
      res.json(driver); 
    } // new driver created data
  }).catch(function(error) {
    console.log("Error creating driver:", error);
    res.sendStatus(500);
  });
};

exports.getDriverInfo = function(req, res) {
  var token = req.params.id;

  Driver.findOne({
    where: { driverToken: token }
  }).then(function(driver) {
    if (!driver) {
      res.sendStatus(404);
    } else {
      res.status(200).json(driver);
    }
  });
};

exports.updateDriverInfo = function(req, res) {
  var token 	= req.params.id,
  	location 	= req.body.location,
  	onDuty 		= req.body.onDuty;

  Driver.update({
    locationLatitude: location[0],
    locationLongitude: location[1],
    onDuty: onDuty
  }, {
    where: { driverToken: token }
  }).then(function(driver) {
    if (!driver) {
      res.sendStatus(404);
    } else {
      res.status(200).json(driver);
    }
  }).catch(function(error) {
    console.log("Error updating driver:", token, error);
    res.sendStatus(500);
  });
};

// Get ALL drivers associated with a company
exports.getDrivers = function(req, res) {
  Driver.findAll().then(function(drivers) {
    res.status(200).json(drivers);
  }).catch(function(error) {
    console.log("Error receiving the drivers:", error);
    res.sendStatus(500);
  });
};

// get specified driver information and filter
// if no id parameter provided, show all drivers

// to do 
// authentication
// query filtering

