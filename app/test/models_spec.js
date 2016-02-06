'use strict';

// set process_env to test to disable detailed logging
process.env.NODE_ENV = 'test';

var chai = require('chai'),
  should = chai.should(),
  User   = require('../models/User'),
  Driver = require('../models/driver');

/** 
 * test models
 **/

// TO DO : add before and after hooks to clean up db

describe.skip('Models', function() {
  describe('#User', function() {
    it('should create a new user', function(done) {
      var user = new User({
        email: 'test@gmail.com',
        password: 'password'
      });
      user.save(function(err) {
        if (err) { return done(err); }
        done();
      });
    });

    it('should not create a user with the unique email', function(done) {
      var user = new User({
        email: 'test@gmail.com',
        password: 'password'
      });
      user.save(function(err) {
        if (err) { err.code.should.equal(11000); }
        done();
      });
    });

    it('should find user by email', function(done) {
      User.findOne({ email: 'test@gmail.com' }, function(err, user) {
        if (err) { return done(err); }
        user.email.should.equal('test@gmail.com');
        done();
      });
    });

    it('should delete a user', function(done) {
      User.remove({ email: 'test@gmail.com' }, function(err) {
        if (err) { return done(err); }
        done();
      });
    });
  });

  describe.skip('#Driver', function() {
    //To Do - add before and after functions to cleanup + seed DB 
    it('should create a new driver', function(done) {
      var driver = new Driver({
        //create unique phone&password to prevent error in later driver creation POST test
        phone: '+1234567890',
        password: 'password'
      });
      driver.save(function(err) {
        if (err) { return done(err); }
        done();
      });
    });
    it('should not create a driver with the unique phone');
    it('should find driver by phone');
    it('should list driver event and order updates');
    it('should delete a driver');
  });

  describe('#Job', function() {
    it('should create a new job');
    it('should not create a job with an existing ID');
    it('should update a job state');
  });
});