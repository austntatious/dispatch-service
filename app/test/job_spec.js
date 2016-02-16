'use strict'; 

// set process_env to test to disable detailed logging
process.env.NODE_ENV = 'test';

var request   = require('supertest'),
  chai        = require('chai'),
  should      = chai.should();
 // model       = require('../../app').sequelize;


 // To Do: clear local db and use seed db file to seed data, also use before/after 
 // hooks to cleanup database after tests**** 
describe.skip('Job API', function () {


  describe('POST /api/jobs', function() {
    it('should create a new job');
    it('should notify certain services when new job successfully created');
    it('should only allow authorized users to POST');
  });

  describe('GET /api/jobs', function() {
    it('should list jobs associated with an organization');
    it('should list jobs from a specific driver');
    it('should list jobs in a specific state/status');
    it('should not allow unauthorized users to view jobs');
  });

  describe('GET /api/jobs/:id', function() {
    it('should show a specific job info');
  });

  describe('PUT /api/jobs/:id', function() {
    it('should update a specific job');
  });
});


/*****************
 * USE CASES ****
 ****************
  * Driver:  
    will need to post/put location to driver document & status update to job document
    will need to GET new orders and instructions 

  * Dispatcher / Admin
    will need to query all job info & statuses (query all jobs associated with organization index key)
    will need to query all driver info & statuses
    will need to query analytics - time driven, time to completion, total jobs this month, etc
      jobs completed and assigned to each driver

  * Client:
    create order via POST job API, receive token to view job status and driver status
    will need to query driver location/status and job status

  * Route optimizer:
    will need to query all driver locations & statuses, job pickups & dropoffs, job statuses
      how to do that efficiently
    will POST route info with specified order of execution 
      (pickup, pickup, dropoff, pickup, dropoff)

  * Analytics:
    will need to aggregate organization's jobs and show the total for a time period
    will need to show each driver's analytics
      total jobs completed per time period
      average time onDuty
      speed between 

**/