'use strict'; 

var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

//TOOD: expire tokens
var tokenSchema = new mongoose.Schema({
  value: { type: String, required: true },
  userId: { type: String, required: true }
});

module.exports = mongoose.model('Token', tokenSchema);