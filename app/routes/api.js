'use strict';

var router = require('express').Router(),
	api    = require('../controllers/api');

/**
 * Dispatch Service api routes
 **/

// to do : add authentication to api routes

// Company api endpoints -- add API keys and authentication & business analytics / insights
router.get('/company', api.company.listCompany)           // List
router.post('/company', api.company.createCompany);       // Create
router.get('/company/:id', api.company.readCompany);      // Read
router.put('/company/:id', api.company.updateCompany);    // Update

// Driver api endpoints
//get all drivers and info associated with organization, allow query logic for different info and drivers
router.get('/drivers', api.driver.listDriver);        // List
router.post('/drivers', api.driver.createDriver);     // Create
router.get('/drivers/:id', api.driver.readDriver);    // Read
router.post('/drivers/:id', api.driver.updateDriver); // Update

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



/** TO DO
//how to filter and query in URL string to return only required fields??
//associate an organization with all jobs and drivers, so all requests will return drivers or 
//jobs that are under that organization
**/

module.exports = router;
