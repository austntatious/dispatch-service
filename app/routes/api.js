'use strict';

var router 			= require('express').Router(),
	apiController 	= require('../controllers/api');

/**
 * Dispatch Service api routes
 **/

// to do : add authentication to api routes

router.post('/drivers', apiController.createDriver);  //create driver
router.get('/drivers/:id', apiController.getDriverInfo);   //get specific driver info
router.get('/drivers', apiController.getDrivers); //get all drivers and info
router.put('/drivers/:id', apiController.updateDriverInfo); //update driver info/status/location


/** TO DO
//how to filter and query in URL string to return only required fields??
//associate an organization with all jobs and drivers, so all requests will return drivers or 
//jobs that are under that organization

router.get('/organizations', );
router.get('/jobs');
router.get('/destinations');
router.get('other');
**/

module.exports = router;
