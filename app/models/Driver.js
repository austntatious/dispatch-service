'use strict'; 

var mongoose = require('mongoose');

var driverSchema = new mongoose.Schema({
  timeCreated: Date,
  timeLastModified: { type: Date, default: Date.now }, 
  organization: String,  //organization ID to associate driver
  name: String,
  phone: String,
  email: String,
  onDuty: Boolean,
  location: Array, //GeoJson or Long Lat ?
  currentJobs: Array, //array of job IDs
  // add analytics to track times and distances 
});

// TO DO
// add mongoose methods to schema

module.exports = mongoose.model('Driver', driverSchema);
