'use strict'; 

var Sequelize = require('sequelize');

module.exports = function (sequelize) {
  var Company = sequelize.define('Company', {
    companyToken: { type: Sequelize.STRING, unique: true },
    name: Sequelize.STRING,
    address: Sequelize.STRING,
    phone: Sequelize.STRING
  });

  return Company;
};