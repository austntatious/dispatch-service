'use strict'; 

var _              = require('lodash'),
    Promise        = require('bluebird'),
    utils          = require('../utils'),
    bcrypt         = require('bcryptjs'),
    mainBookshelf = require('./base'),
    crypto         = require('crypto'),
    validator      = require('validator'),
    request        = require('request'),

    bcryptGenSalt  = Promise.promisify(bcrypt.genSalt),
    bcryptHash     = Promise.promisify(bcrypt.hash),
    bcryptCompare  = Promise.promisify(bcrypt.compare),

    tokenSecurity  = {},
    activeStates   = ['active', 'warn-1', 'warn-2', 'warn-3', 'warn-4', 'locked'],
    invitedStates  = ['invited', 'invited-pending'],
    Organization,
    Organizations;


// To Do : add event listeners to act on emitted changed events

Organization = mainBookshelf.Model.extend({

    tableName: 'drivers',

    drivers: function organizations() {
        return this.hasMany('Driver');
    },

    jobs: function jobs() {
        return this.hasMany('Job');
    },

    stops: function stops() {
      return this.hasMany('Stop');
    },

    admins: function stops() {
        return this.hasMany('Admin');
    },

    /**
     * ### Find One
     * @extends mainBookshelf.Model.findOne to handle post status
     * **See:** [mainBookshelf.Model.findOne](base.js.html#Find%20One)
     */
    findOne: function findOne(data, options) {
        options = options || {};

        return mainBookshelf.Model.findOne.call(this, data, options).then(function then(organization) {

            return organization;
        });
    },
    /**
     * ### Add
     * @extends mainBookshelf.Model.add to handle returning the full object
     * **See:** [mainBookshelf.Model.add](base.js.html#add)
     */
    add: function add(data, options) {
        var self = this;
        options = options || {};

        mainBookshelf.Model.add.call(this, data, options).then(function then(organization) {
            // return the created model
            return self.findOne({id: organization.id}, options);
        });
    },

    // update an organization's info
    /**
     * ### Edit
     * @extends mainBookshelf.Model.edit to handle returning the full object and manage _updatedAttributes
     * **See:** [mainBookshelf.Model.edit](base.js.html#edit)
     */
    edit: function edit(data, options) {
        var self = this;
        options = options || {};

        return mainBookshelf.Model.edit.call(this, data, options).then(function then(organization) {
            return self.findOne({status: 'all', id: options.id}, options)
                .then(function then(found) {
                    if (found) {
                        // Pass along the updated attributes for checking status changes
                        found._updatedAttributes = organization._updatedAttributes;
                        return found;
                    }
                });
        });
    },
    // api key for organization

});


Organizations = mainBookshelf.Collection.extend({
    model: Organization
});

module.exports = {
    Organization: mainBookshelf.model('Organization', Organization),
    Organizations: mainBookshelf.collection('Organizations', Organizations)
};