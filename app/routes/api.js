'use strict';

var router       = require('express').Router(),
	passportConf = require('../../config/passport'),
	api          = require('../controllers/api');

/**
 * Dispatch Service api routes
 **/

// to do : add authentication to api routes

// ## Company api endpoints -- add API keys and authentication & business analytics / insights
router.get('/company', api.company.listCompany);          // List
router.post('/company', api.company.createCompany);       // Create
router.get('/company/:id', api.company.readCompany);      // Read
router.put('/company/:id', api.company.updateCompany);    // Update

// ## Driver api endpoints
//get all drivers and info associated with organization, allow query logic for different info and drivers
router.post('/drivers/login', api.driver.login);        // Retrieve access token for driver.
router.get('/drivers', api.driver.listDriver);        // List
router.post('/drivers', api.driver.createDriver);     // Create
router.get('/drivers/:id', api.driver.readDriver);    // Read
router.post('/drivers/:id', api.driver.updateDriver); // Update

// ## Job api endpoints
router.post('/jobs', api.job.createJob);        // Create
router.get('/jobs/:id', api.job.getJob);        // Get job info
router.put('/jobs/:id', api.job.updateJob);     // Update job
router.get('/jobs', api.job.getJobs);           // Get all jobs
// To do: add delete, cancellation, and filter responses




/** TO DO
//how to filter and query in URL string to return only required fields??
//associate an organization with all jobs and drivers, so all requests will return drivers or 
//jobs that are under that organization
**/

module.exports = router;
