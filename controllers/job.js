var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var Job = require('../models/Job');
var secrets = require('../config/secrets');


////////////////////////////////////////////
/////////Location and Status Updates////////
////////////////////////////////////////////
/**
exports.createJob = function(req, res) {

}

exports.getJob = function (req, res) {
//get specified job information and filter

}

exports.updateJob = function (req. res) {
//update specific information on job like state
}
*/

/////////////////////////////////////
//////////AUTHENTICATION////////////
////////////////////////////////////
