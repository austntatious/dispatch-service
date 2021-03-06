'use strict';

var Sequelize = require('sequelize');

module.exports = function (sequelize) {
  var Stop = sequelize.define('Stop', {
    StopToken: { type: Sequelize.STRING, unique: true },
    firstName: { type: Sequelize.STRING },
    lastName: { type: Sequelize.STRING },
    accountToken: { type: Sequelize.STRING },
    phone: { type: Sequelize.STRING, unique: true },
    onDuty: { type: Sequelize.BOOLEAN },
    locationLatitude: { type: Sequelize.DOUBLE },
    locationLongitude: { type: Sequelize.DOUBLE },
    locationUpdatedAt: { type: Sequelize.DATE},
  });

  return Stop;
};