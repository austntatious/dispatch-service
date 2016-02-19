'use strict'; 

// set process_env to test to disable detailed logging
process.env.NODE_ENV = 'test';

var request = require('supertest'),
  chai      = require('chai'),
  should    = chai.should();

// To do: make sure route integration tests connect to a testing server

// Basic tests for checking all main web app routes
describe.skip('Web app endpoints', function() {
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
});