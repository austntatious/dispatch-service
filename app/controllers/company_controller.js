'use strict';

var logger  = require('../../config/logger'),
    model   = require('../../app').sequelize,
    company = require('../models/company')(model),
    token   = require('../util/token');

var createcompanyToken = function() {
  return "company:" + token.createToken()
};

exports.createCompany = function(req, res) {
  
  //TODO sanitize request with express validator
  req.assert('name', 'Name cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    res.json({ msg: errors });
    return logger.error(errors);
  }

  // send company data and create new entry unless already existing

  company.create({ 
      companyToken: createcompanyToken(),
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone
  }).then(function(company) {
    console.log("Created company:", company);
    res.json(company); 
  }).catch(function(error) {
    console.log("Error creating company:", error);
    res.sendStatus(500);
  });
};

exports.readCompany = function(req, res) {
  var token = req.params.id;

  company.findOne({
    where: { companyToken: token }
  }).then(function(company) {
    if (!company) {
      res.sendStatus(404);
    } else {
      res.status(200).json(company);
    }
  });
};

exports.updateCompany = function(req, res) {
  var token   = req.params.id;
  var name    = req.body.name;
  var address = req.body.address;
  var phone   = req.body.phone;

  company.update({
    name    : name,
    address : address,
    phone   : phone
  }, {
    where: { companyToken: token }
  }).then(function(company) {
    if (!company) {
      res.sendStatus(404);
    } else {
      res.status(200).json(company);
    }
  }).catch(function(error) {
    console.log("Error updating company:", token, error);
    res.sendStatus(500);
  });
};

// Get ALL companys associated with a company
exports.listCompany = function(req, res) {
  company.findAll().then(function(companies) {
    res.status(200).json(companies);
  }).catch(function(error) {
    console.log("Error receiving the companies:", error);
    res.sendStatus(500);
  });
};
