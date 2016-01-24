'use strict'; 

// set process_env to test to disable detailed logging
process.env.NODE_ENV = 'test';

var request   = require('supertest'),
  app         = require('../app.js').main,
  chai        = require('chai'),
  should      = chai.should(),
  model       = require('../app').sequelize,
  Driver      = require('../app/models/Driver')(model);

//Test variables
var randomDigits  = Math.floor((Math.random() * 1000000000) + 10000000000);
var testPhone     = '+' + randomDigits.toString(); 
var testFirstName = 'Liu';
var testLastName  = 'Kang'
var testEmail     = 'test@example.com';
var testPassword  = 'password';
var testLong      = (Math.random() * 10) + 70; 
var testLat       = -((Math.random() * 10) + 40);

/**
 * Dispatch API endpoints
 */

 // To Do: clear local db and use seed db file to seed data, also use before/after 
 // hooks to cleanup database after tests**** 
describe('Dispatch API endpoints', function () {
  describe('POST /api/drivers', function() {
    it('should create a new unique driver', function(done) {
      request(app)
      .post('/api/drivers')
      .send({
        'firstName' : testFirstName,
        'lastName'  : testLastName,
        'phone'     : testPhone
      })
      .expect(200)
      .end(function(err, res) {
        if(err) { return done(err); }
        res.body.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('latitude');
        res.body.should.have.property('longitude');
        res.body.firstName.should.equal(testFirstName);
        res.body.lastName.should.equal(testLastName);
        done();
      });
    });
    it('should return error or msg if driver already exists', function(done) {
      request(app)
      .post('/api/drivers')
      .send({
        'firstName' : testFirstName,
        'lastName'  : testLastName,
        'phone'     : testPhone
      })
      .expect(200)
      .end(function(err, res) {
        if(err) { return done(err); }
        res.body.should.be.json;
        res.body.should.be.a('object');
        res.body.msg.should.equal('Driver already exists');
        done();
      });
    });
    it('should return error msg if not all appropriate fields are in request');
    it('should send a twilio text to newly created driver');
    it('should not let unauthorized POST');
  });

  describe.skip('GET /api/drivers', function() {
    // to do: seed db with test data then clear db up after tests
    it('should list all drivers in a specific organization', function(done) {
      request(app)
      .get('/api/drivers')
      .expect(200)
      .end(function(err, res) {
        if (err) { return done(err); }
        res.body.should.be.json;
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('location');
        res.body[0].should.have.property('_id');
        done();
      });
    });
    it('should not show drivers to unauthorized users');
  });

  describe.skip('PUT /api/drivers/:id', function() {
    var testDriverId;
    before(function(done) {
      Driver.findOne({ phone: testPhone }, function(err, driver) {
        if (!driver) { return done(err); } //fix error handling
        testDriverId = driver._id;
        done();
      });
    });
    it('should update driver location', function(done) {
      request(app)
        .put('/api/drivers/' + testDriverId)
        .send({ 'location': testGeo })
        .expect(201)
        .end(function(err, res) {
          if(err) { return done(err); }
          res.body.should.be.json;
          res.body.location[0].should.equal(testGeo[0]);
          res.body.location[1].should.equal(testGeo[1]);
          res.body.location.length.should.equal(2);
          done();
        });
    });
    it('should update driver active status to true', function(done) {
      request(app)
        .put('/api/drivers/' + testDriverId)
        .send({ 'active': true })
        .expect(201)
        .end(function(err, res) {
          if(err) { return done(err); }
          res.body.active.should.equal(true);
          done();
        });
    });
    it('should not allow unauthorized users to update driver');
    //before function to make sure driver_id exists
    //after function to clear data from driver_id
  });

  describe.skip('GET /api/drivers/:id', function() {
    var testDriverId;
    before(function(done) {
      Driver.findOne({ phone: testPhone }, function(err, driver) {
        if (!driver) { return done(err); } //fix error handling
        testDriverId = driver._id;
        done();
      });
    });
    it('should show a specific driver info', function(done) {
      request(app)
        .get('/api/drivers/' + testDriverId)
        .expect(200)
        .end(function(err, res) {
          if(err) { return done(err); }
          res.body.should.be.json;
          res.body.active.should.be.a('boolean');
          res.body.name.should.equal(testName);
          res.body.phone.should.equal(testPhone);
          done();
        });
    });
    it('should allow you to filter for specific property value');
    it('should not allow unauthorized users to view a driver info');
  });

  describe('DELETE /api/drivers', function () {
    it('should delete a specific driver');
  });

  describe('POST /api/drivers/login', function() {
    it('should login a registered driver');
    it('should return the drivers id to use for new queries');
    it('should show error if wrong username');
    it('should show error if wrong password');
  });


  describe('POST /api/jobs', function() {
    it('should create a new job');
    it('should notify certain services when new job successfully created');
    it('should only allow authorized users to POST');
  });

  describe('GET /api/jobs', function() {
    it('should list jobs associated with an organization');
    it('should list jobs from a specific driver');
    it('should list jobs in a specific state/status');
    it('should not allow unauthorized users to view jobs')
  });

  describe('GET /api/jobs/:id', function() {
    it('should show a specific job info');
  });

  describe('PUT /api/jobs/:id', function() {
    it('should update a specific job');
  });
});

/**TO DO
*how to join driver's jobs or query jobs based on a driver's ID index
 cache frequently updated endpoints like driver's location
**/

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