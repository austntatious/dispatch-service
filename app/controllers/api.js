'use strict';

var _				= require('lodash'),
	organizations	= require('./organizations'),
	drivers 			= require('./drivers'),
	http,
	Promise			= require('bluebird');


/**
 * ### HTTP
 *
 * Decorator for API functions which are called via an HTTP request. Takes the API method and wraps it so that it gets
 * data from the request and returns a sensible JSON response.
 *
 * @public
 * @param {Function} apiMethod API method to call
 * @return {Function} middleware format function to be called by the route when a matching request is made
 */
http = function http(apiMethod) {
    return function apiHandler(req, res, next) {
        // We define 2 properties for using as arguments in API calls:
        var object = req.body,
            options = _.extend({}, req.files, req.query, req.params, {
                context: {
                    user: (req.user && req.user.id) ? req.user.id : null
                }
            });

        // If this is a GET, or a DELETE, req.body should be null, so we only have options (route and query params)
        // If this is a PUT, POST, or PATCH, req.body is an object
        if (_.isEmpty(object)) {
            object = options;
            options = {};
        }

        return apiMethod(object, options).then(function then(response) {
            // Send a properly formatting HTTP response containing the data with correct headers
            res.json(response || {});
        }).catch(function onAPIError(error) {
            // To be handled by the API middleware
            next(error);
        });
    };
};

module.exports = {
	http: http,
	organizations: organizations,
	drivers: drivers
};