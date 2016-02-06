'use strict'; 

var Sequelize = require('sequelize');

// Default Query should always query based on organization ID ***
// DEFAULT SCOPE IS ORGANIZATION 
module.exports = function (sequelize) {
  var Driver = sequelize.define('Driver', {
    driverToken: { type: Sequelize.STRING, unique: true },
    firstName: { type: Sequelize.STRING },
    lastName: { type: Sequelize.STRING },
    accountToken: { type: Sequelize.STRING },
    phone: { type: Sequelize.STRING, unique: true },
    onDuty: { type: Sequelize.BOOLEAN },
    locationLatitude: { type: Sequelize.DOUBLE },
    locationLongitude: { type: Sequelize.DOUBLE },
    locationUpdatedAt: { type: Sequelize.DATE},
    // ADD SCHEDULE and startime or end time
  });

  return Driver;
};
  // TO DO : Add foreign keys, relationships, and indexes

  // Belongs to ONE organization
  // Has many jobs -- orders have TWO tasks
  // Has one route


