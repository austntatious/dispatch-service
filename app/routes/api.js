'use strict';

var router 			= require('express').Router(),
	apiController 	= require('../controllers/api');

/**
 * Dispatch Service api routes
 **/

// to do : add authentication to api routes

// Driver api endpoints
router.post('/drivers', apiController.createDriver);  //create driver
router.get('/drivers/:id', apiController.getDriverInfo);   //get specific driver info and filter values
//get all drivers and info associated with organization, allow query logic for different info and drivers
router.get('/drivers', apiController.getDrivers); 
router.put('/drivers/:id', apiController.updateDriverInfo); //update driver info/status/location

/**
router.post('/drivers/login', apiController.postDriverAuth); // authenticate a driver
router.delete('/drivers/:id', apiController.deleteDriver); // Destroy Driver

// Job api endpoints
router.post('/jobs', apiController.createJob); // create new Job
router.get('/jobs/:id', apiController.getJobInfo);  // get job info and filter values
router.put('/jobs/:id', apiController.updateJob); // update specific job
// query based on multiple parameters,get job info based on either Driver or current status
router.get('/jobs', apiController.getJobs); 
router.delete('/jobs/:id', apiController.deleteJob); // delete specified job

// Organization api endpoints -- add API keys and authentication & business analytics / insights
router.post('/organization', apiController.createOrganization); // create new organization
router.get('/organization/:id', apiController.getOrganizationInfo); // info on specific organization
router.put('/organization/:id', apiController.updateOrganization); // update specific organzation 
router.delete('/organization/:id', apiController.deleteOrganization); // deleted specified org

/** TO DO
//how to filter and query in URL string to return only required fields??
//associate an organization with all jobs and drivers, so all requests will return drivers or 
//jobs that are under that organization
**/

module.exports = router;
