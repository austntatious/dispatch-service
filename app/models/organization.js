'use strict'; 

var _              = require('lodash'),
    Promise        = require('bluebird'),
    errors         = require('../errors'),
    utils          = require('../utils'),
    bcrypt         = require('bcryptjs'),
    mainBookshelf = require('./base'),
    crypto         = require('crypto'),
    validator      = require('validator'),
    request        = require('request'),
    events         = require('../events'),
    i18n           = require('../i18n'),

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

        data = _.defaults(data || {}, {
            status: 'published'
        });

        if (data.status === 'all') {
            delete data.status;
        }

        // Add related objects
        options.withRelated = _.union(options.withRelated, _.pull(
            [].concat(options.include),
            'next', 'next.author', 'next.tags', 'previous', 'previous.author', 'previous.tags')
        );

        return mainBookshelf.Model.findOne.call(this, data, options).then(function then(post) {
            if ((withNext || withPrev) && post && !post.page) {
                var publishedAt = post.get('published_at'),
                    prev,
                    next;

                if (withNext) {
                    next = Organization.forge().query(function queryBuilder(qb) {
                        qb.where('status', '=', 'published')
                            .andWhere('page', '=', 0)
                            .andWhere('published_at', '>', publishedAt)
                            .orderBy('published_at', 'asc')
                            .limit(1);
                    }).fetch({withRelated: nextRelations});
                }

                if (withPrev) {
                    prev = Organization.forge().query(function queryBuilder(qb) {
                        qb.where('status', '=', 'published')
                            .andWhere('page', '=', 0)
                            .andWhere('published_at', '<', publishedAt)
                            .orderBy('published_at', 'desc')
                            .limit(1);
                    }).fetch({withRelated: prevRelations});
                }

                return Promise.join(next, prev)
                    .then(function then(nextAndPrev) {
                        if (nextAndPrev[0]) {
                            post.relations.next = nextAndPrev[0];
                        }
                        if (nextAndPrev[1]) {
                            post.relations.previous = nextAndPrev[1];
                        }
                        return post;
                    });
            }

            return post;
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

        return mainBookshelf.Model.add.call(this, data, options).then(function then(organization) {
            return self.findOne({status: 'all', id: organization.id}, options);
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
    Driver: mainBookshelf.model('Organization', Organization),
    Drivers: mainBookshelf.collection('Organizations', Organizations)
};