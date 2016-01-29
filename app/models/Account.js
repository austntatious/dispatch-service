'use strict'; 

var Sequelize = require('sequelize');

// Default Query should always query based on organization ID ***
// DEFAULT SCOPE IS ORGANIZATION 
module.exports = function (sequelize) {
	var Account = sequelize.define('Account', {
	    accountToken: Sequelize.STRING,
	    type: Sequelize.INTEGER,
	    identityToken: Sequelize.STRING,
	    email: Sequelize.STRING,
	    password: Sequelize.STRING
    });
   return Account;
};