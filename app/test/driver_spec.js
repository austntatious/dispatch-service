'use strict';

process.env.NODE_ENV = 'test';

var request   = require('supertest'),
  app         = require('../../app').main,
  chai        = require('chai'),
  should      = chai.should(),

// TO DO: MOVE TO testUtils file
//Test variables
    randomDigits    = Math.floor((Math.random() * 1000000000) + 10000000000),
    testPhone       = '+' + randomDigits.toString(),
    testFirstName   = 'Liu',
    testLastName    = 'Kang',
    testEmail       = 'test@example.com',
    testPassword    = 'password',
    testLong        = (Math.random() * 10) + 70,
    testLat         = -((Math.random() * 10) + 40);
  

describe.skip('Driver API', function() { 
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
          res.body.should.have.property('location');
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

    describe('GET /api/drivers', function() {
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

    describe('PUT /api/drivers/:id', function() {
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

    describe('GET /api/drivers/:id', function() {
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
});