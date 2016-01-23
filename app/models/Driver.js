'use strict'; 

var Sequelize = require('sequelize');

  var Driver = Sequelize.define('Driver', {
    // Postgres autogenerates UUID and timestamps
    accountToken: {
      type: Sequelize.STRING,
      field: 'account_token'
    },
    passwordToken: {
      type: Sequelize.STRING,
      field: 'password_token',
      unique: true,
    },
    firstName: {
      type: Sequelize.STRING,
      field: 'first_name'
    },
    lastName: {
      type: Sequelize.STRING,
      field: 'last_name'
    },
    phone: {
      type: Sequelize.STRING,
      unique: true
      // add validation
    },
    latitude: {
      type: Sequelize.INTEGER
    },
    longitude: {
      type: Sequelize.INTEGER
    },
    locationLastUpdated: {

    }
  }, {
      // OPTIONS
      // add autoIncrement IDs
    // classMethods:
    underscored: true
  });

  // TO DO : Add foreign keys, relationships, and indexes


module.exports = Driver;

