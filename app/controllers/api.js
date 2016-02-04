/**
 *  All API controllers -- Drivers, Jobs, Companies, Routes, etc etc
*/

'use strict'; 

var driver  = require('./driver_controller');
var company = require('./company_controller');

module.exports = {
  driver  : driver,
  company : company
};

// get specified driver information and filter
// if no id parameter provided, show all drivers

// to do 
// authentication
// query filtering

