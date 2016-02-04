'use strict';

var	api 			= require('../controllers/api'),
	apiRoutes;

apiRoutes = function apiRoutes() {
	var router 			= require('express').Router();
	/**
	 * Dispatch Service api routes
	 **/

	// to do : add authentication to api routes
	// 		- add route index and bootstrap all middleware, authentication, and settings
	//		- route index will have base api and admin web app auth 

	// ## Organization api endpoints -- add API keys and authentication & business analytics / insights 
	router.post('/organization', api.http(api.organizations.add)); // create new organization
	/**
	router.get('/organization/:id', apiController.findOrganization); // info on specific organization
	router.put('/organization/:id', apiController.editOrganization); // update specific organzation 
	router.delete('/organization/:id', apiController.deleteOrganization); // deleted specified org
	**/

	/**
	// ## Driver api endpoints
	router.post('/drivers', apiController.createDriver);  		//create driver
	router.get('/drivers/:id', apiController.getDriverInfo);   //get specific driver info and filter values
	//get all drivers and info associated with organization, allow query logic for different info and drivers
	router.get('/drivers', apiController.getDrivers); 
	router.put('/drivers/:id', apiController.updateDriverInfo); //update driver info/status/location


	/**
	router.post('/drivers/login', apiController.postDriverAuth); // authenticate a driver
	router.delete('/drivers/:id', apiController.deleteDriver); // Destroy Driver


	// ## Job api endpoints
	router.post('/jobs', apiController.createJob); // create new Job
	router.get('/jobs/:id', apiController.getJobInfo);  // get job info and filter values
	router.put('/jobs/:id', apiController.updateJob); // update specific job
	// query based on multiple parameters,get job info based on either Driver or current status
	router.get('/jobs', apiController.getJobs); 
	router.delete('/jobs/:id', apiController.deleteJob); // delete specified job


	// ## Authentication endpoints for BOTH drivers and admins
	router.post('/authentication/passwordreset', middleware.spamPrevention.forgotten,
	    api.http(api.authentication.generateResetToken)
	);
	router.put('/authentication/passwordreset', api.http(api.authentication.resetPassword));
	router.post('/authentication/invitation', api.http(api.authentication.acceptInvitation));
	router.get('/authentication/invitation', api.http(api.authentication.isInvitation));
	router.post('/authentication/setup', api.http(api.authentication.setup));
	router.put('/authentication/setup', authenticatePrivate, api.http(api.authentication.updateSetup));
	router.get('/authentication/setup', api.http(api.authentication.isSetup));

	// Get Access Token ! 
	router.post('/authentication/token',
	    middleware.spamPrevention.signin,
	    middleware.api.authenticateClient,
	    middleware.oauth.generateAccessToken
	);

	router.post('/authentication/revoke', authenticatePrivate, api.http(api.authentication.revoke));
	**/
	/** TO DO
	//how to filter and query in URL string to return only required fields??
	//associate an organization with all jobs and drivers, so all requests will return drivers or 
	//jobs that are under that organization
	**/
	return router;
};


module.exports = apiRoutes;
