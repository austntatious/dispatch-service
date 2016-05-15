/**
 *  All API controllers -- Drivers, Jobs, Companies, Routes, etc etc
*/

'use strict'; 

var driver  = require('./driver_controller'),
    company = require('./company_controller'),
    job     = require('./job_controller');

module.exports = {
  driver  : driver,
  company : company,
  job     : job
};

// get specified driver information and filter
// if no id parameter provided, show all drivers

// to do 
// authentication
// query filtering

