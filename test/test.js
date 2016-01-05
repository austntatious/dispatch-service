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

describe('User Model', function() {
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

describe('Driver Model', function() {
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
  it('should delete a driver');
  it('should list driver event and order updates');
});

describe('Job Model', function() {
  it('should create a new job');
  it('should not create a job with an existing ID');
  it('should update a job state');
});

/**
 * Dispatch API endpoints
 */

describe('POST /api/drivers', function() {
  it('should create a new unique driver');
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

describe('POST /api/drivers/login', function() {
  it('should login a registered driver');
  it('should return the drivers id to use for new queries');
  it('should show error if wrong username');
  it('should show error if wrong password');
})

describe('GET /api/drivers/56843c5e498f147e130c234e', function() {
  it('should show a specific driver info');
  it('should allow you to filter for specific property value')
  it('should not allow unauthorized users to view a driver info');
});

describe('PUT /api/drivers/:id', function() {
  it('should update driver location', function(done) {
    request(app)
      .put('/api/drivers/56843c5e498f147e130c234e')
      .send({'location': [71.32, -43.04]})
      .expect(200)
      .end(function(err, res) {
        if(err) return done(err);
        res.body.should.be.json;
        done();
      })
  });
  it('should update driver status or state');
  it('should not allow unauthorized users to update driver');
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

//TO DO
//how to join driver's jobs or query jobs based on a driver's ID index
//cache frequently updated endpoints like driver's location
//