'use strict'; 

var Sequelize = require('sequelize');

// Default Query should always query based on company ID ***
// DEFAULT SCOPE IS COMPANY 
module.exports = function (sequelize) {
	var account = sequelize.define('account', {
	    accountToken: Sequelize.STRING,
	    type: Sequelize.INTEGER,
	    identityToken: Sequelize.STRING,
	    email: Sequelize.STRING,
	    password: Sequelize.STRING
    });
   return account;
};