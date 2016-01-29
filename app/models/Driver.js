'use strict'; 

var Sequelize = require('sequelize');

// Default Query should always query based on organization ID ***
// DEFAULT SCOPE IS ORGANIZATION 
module.exports = function (sequelize) {
  var Driver = sequelize.define('Driver', {

    driverToken: Sequelize.STRING,

    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,

    accountToken: Sequelize.STRING,
    phone: Sequelize.STRING,

    onDuty: Sequelize.BOOLEAN,

    locationLatitude: Sequelize.DOUBLE,
    locationLongitued: Sequelize.DOUBLE,
    locationUpdatedAt: Sequelize.DATE,
  });
  return Driver;
};
  // TO DO : Add foreign keys, relationships, and indexes

  // Belongs to ONE organization
  // Has many jobs -- orders have TWO tasks
  // Has one route


