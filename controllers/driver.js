var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var passport = require('passport');
var Driver = require('../models/Driver');
var secrets = require('../config/secrets');


//Create new driver and send twilio message with app download link 

exports.createDriver = function(req, res, next) {
  //TODO sanitize request with express validator
  if (errors) {
    res.json({msg: errors});
    return 
  }

  var driver = new Driver({
    phone: req.body.phone,
    password: req.body.password
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

exports.getInfo = function(req, res) {
  Driver.findOne(req.params.id, function(err, driver) {
    if (err) return err;
    res.status(200).json(driver)
  })
}

exports.updateInfo = function(req, res) {
  Driver.findOne(req.params.id, function(err, driver) {
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

