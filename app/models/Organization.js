'use strict'; 

var Sequelize = require('sequelize');

module.exports = function (sequelize) {
   var Organization = sequelize.define('Organization', {

    accountToken: { // WHAT IS THIS FOR -- FIGURE OUT AUTHENITCATION / Use HTTP Basic AUTH
      type: Sequelize.STRING,
      field: 'account_token'
    },
    passwordToken: {
      type: Sequelize.STRING,
      field: 'password_token',
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
      unique: true
      // add validation
    },
    address: {  // address for bookkeeping and admin purposes
      type: Sequelize.TEXT
    },
    location: {  // Geographic location to partition orders and other info around
      type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
  }, {
      // OPTIONS
      // add autoIncrement IDs
      // classMethods:
    underscored: true
  });
   return Organization;
};