'use strict'; 

var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var passport = require('passport');
var Driver = require('../models/Driver');
var secrets = require('../config/secrets');


//Create new driver and send twilio message with app download link 

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
      if (err) {
        return next(err);
      }
      res.status(200).json(driver);
    });
  });
};

exports.getDriverInfo = function(req, res) {
  Driver.findById(req.params.id, function(err, driver) {
    if (err) return err;
    res.status(200).json(driver)
  })
}

exports.updateDriverInfo = function(req, res) {
  Driver.findById(req.params.id, function(err, driver) {
    location = req.body.location;
    driver.save(function(err) {
      if(err) return err;
    });

    res.status(200).json(driver);
  });
}

exports.getDrivers = function(req, res) {
  Driver.find({}, function(err, drivers) {
    res.status(200).json(drivers);
  });
}

//get specified driver information and filter
//if no id parameter provided, show all drivers

//to do 
//authentication
//query filtering

