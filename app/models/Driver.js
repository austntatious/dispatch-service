'use strict'; 

var mongoose = require('mongoose');

var driverSchema = new mongoose.Schema({
  updatedAt: { type: Date, default: Date.now() }, 
  organization: String,  //organization ID to associate driver
  name: String,
  phone: String,
  email: String,
  password: String, //hash the password and return json token
  active: { type: Boolean, default: false },
  location: Array, //GeoJson or Long Lat ?
  currentJobs: [], //array of job ref IDs
  route: Array, // array of pickup and dropoff objects
                // e.g. [{type: pickup, jobid: refId }, {pickup: }, {dropoff: }]
                // allow driver to mark task as delayed

  // add analytics to track times and distances 
});

// TO DO
// add mongoose methods to schema

module.exports = mongoose.model('Driver', driverSchema);
