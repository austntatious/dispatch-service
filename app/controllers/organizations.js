'use strict';

// ## Organization 

var dataProvider = require('../models'),
	organizations;

	// create new organization
	// @param {post} object
	// Todo:  add @param {{context, include..}} options to filter values
	console.log('ORGANIZATION DATA MODEL');
organizations = {
	add:  function add(object, options) {
		// query the model layer with the supplied data
			return dataProvider.Organizations.add(object, options);
			}

};

module.exports = organizations;