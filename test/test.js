'use strict'; 

var request = require('supertest');
var app = require('../app.js');
var chai = require('chai');
var should = chai.should();

var User = require('../models/User');
var Driver = require('../models/Driver');

// Basic tests for checking all main web app routes
describe('GET /', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

describe('GET /login', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/login')
      .expect(200, done);
  });
});

describe('GET /signup', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/signup')
      .expect(200, done);
  });
});

describe('GET /plugins', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/plugins')
      .expect(200, done);
  });
});

describe('GET /contact', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/contact')
      .expect(200, done);
  });
});

describe('GET /random-url', function() {
  it('should return 404', function(done) {
    request(app)
      .get('/reset')
      .expect(404, done);
  });
});

/** 
 * test models
 **/
describe('Models', function() {
  describe('#User', function() {
    it('should create a new user', function(done) {
      var user = new User({
        email: 'test@gmail.com',
        password: 'password'
      });
      user.save(function(err) {
        if (err) return done(err);
        done();
      })
    });

    it('should not create a user with the unique email', function(done) {
      var user = new User({
        email: 'test@gmail.com',
        password: 'password'
      });
      user.save(function(err) {
        if (err) err.code.should.equal(11000);
        done();
      });
    });

    it('should find user by email', function(done) {
      User.findOne({ email: 'test@gmail.com' }, function(err, user) {
        if (err) return done(err);
        user.email.should.equal('test@gmail.com');
        done();
      });
    });

    it('should delete a user', function(done) {
      User.remove({ email: 'test@gmail.com' }, function(err) {
        if (err) return done(err);
        done();
      });
    });
  });

  describe('#Driver', function() {
    //To Do - add before and after functions to cleanup + seed DB 
    it('should create a new driver', function(done) {
      var driver = new Driver({
        phone: '+123456789',
        password: 'password'
      });
      driver.save(function(err) {
        if (err) return done(err);
        done();
      })
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

/**
 * Dispatch API endpoints
 */

 //To Do: clear local db and use seed db file to seed data, also use before/after 
 //hooks to cleanup database **** 
describe('Dispatch API endpoints', function () {
  describe('POST /api/drivers', function() {
    it('should create a new unique driver', function(done) {
      request(app)
      .post('/api/drivers')
      .send({
        'name': 'testy', 
        'phone': '+3242645345'}) //make sure phone and name are unique
      .expect(200)
      .end(function(err, res) {
        if(err) return done(err);
        res.body.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('location');
        res.body.should.have.property('name');
        res.body.name.should.equal('testy');
        done();
      })
    });
    it('should return error or msg if driver already exists')
    it('should send a twilio text to newly created driver');
    it('should not let unauthorized POST');
  });

  describe('GET /api/drivers', function() {
    //to do: seed db with test data then clean up after tests
    it('should list all drivers in a specific organization', function(done) {
      request(app)
      .get('/api/drivers')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
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
    //THIS IS NOT PASSING YET
    //figure out how to update location array
    //seed with test driver so it can be updated
    it('should update driver location', function(done) {
      request(app)
        .put('/api/drivers/56843c5e498f147e130c234e')
        .send({'location': [71.32, -43.04]})
        .expect(200)
        .end(function(err, res) {
          if(err) return done(err);
          res.body.should.be.json;
          res.body[0].location[0].should.equal(71.32);
          done();
        })
    });
    it('should update driver status or state');
    it('should not allow unauthorized users to update driver');
  });

  describe('POST /api/drivers/login', function() {
    it('should login a registered driver');
    it('should return the drivers id to use for new queries');
    it('should show error if wrong username');
    it('should show error if wrong password');
  })

  describe('GET /api/drivers/:id', function() {
    it('should show a specific driver info');
    it('should allow you to filter for specific property value')
    it('should not allow unauthorized users to view a driver info');
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



/**
 *  Setup and clear db before and after tests
 
before(function(done) {
  connect(function(error, conn) {
    if (error) {
      return done(error);
    }
    db = conn;
    db.collection('movies').remove({}, function(error) {
      if (error) {
        return done(error);
      }

      var fns = [];
      movies.movies.forEach(function(movie) {
        fns.push(function(callback) {
          dbInterface.insert(db, movie, callback);
        });
      });
      require('async').parallel(fns, done);
    });
  });
});

  /**
   *  The below code generates the answer code that we will use to
   *  verify you got the correct answer. Modifying this code is a
   *  violation of the honor code.
   
after(function(done) {
  if (succeeded >= 2) {
    var _0xc3a0=["\x74\x65\x73\x74","\x6C\x65\x6E\x67\x74\x68","\x2E\x2F\x6F\x75\x74\x70\x75\x74\x2E\x64\x61\x74","\x74\x68\x65\x20\x6D\x65\x61\x6E\x20\x73\x74\x61\x63\x6B\x20\x61\x77\x61\x6B\x65\x6E\x73","\x77\x72\x69\x74\x65\x46\x69\x6C\x65\x53\x79\x6E\x63","\x66\x73"];var x={};x[_0xc3a0[0]]=georgeLucasMovies[_0xc3a0[1]];require(_0xc3a0[5])[_0xc3a0[4]](_0xc3a0[2],x[_0xc3a0[0]]===4&&_0xc3a0[3]);
    db.close(done);
  } else {
     db.close(done);
    }
  });

  */