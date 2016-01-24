'use strict'; 

var Sequelize = require('sequelize');

// Default Query should always query based on organization ID ***
// DEFAULT SCOPE IS ORGANIZATION 
module.exports = function (sequelize) {
   var Driver = sequelize.define('Driver', {

    accountToken: { // WHAT IS THIS FOR -- FIGURE OUT AUTHENITCATION 
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
    onDuty: {
      type: Sequelize.BOOLEAN
    },
    location: {
      type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
  }, {
      // OPTIONS
      // add autoIncrement IDs
      // classMethods:
    underscored: true
  });
   return Driver;
};
  // TO DO : Add foreign keys, relationships, and indexes

  // Belongs to ONE organization
  // Has many jobs -- orders have TWO tasks
  // Has one route


