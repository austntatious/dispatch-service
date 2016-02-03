'use strict'; 

var _              = require('lodash'),
    Promise        = require('bluebird'),
    bcrypt         = require('bcryptjs'),
    mainBookshelf  = require('./base'),
    crypto         = require('crypto'),
    validator      = require('validator'),
    request        = require('request'),
    events		   = require('../events'),	

    bcryptGenSalt  = Promise.promisify(bcrypt.genSalt),
    bcryptHash     = Promise.promisify(bcrypt.hash),
    bcryptCompare  = Promise.promisify(bcrypt.compare),

    tokenSecurity  = {},
    activeStates   = ['active', 'warn-1', 'warn-2', 'warn-3', 'warn-4', 'locked'],
    invitedStates  = ['invited', 'invited-pending'],
    Driver,
    Drivers;

function validatePasswordLength(password) {
    return validator.isLength(password, 8);
}

function generatePasswordHash(password) {
    // Generate a new salt
    return bcryptGenSalt().then(function (salt) {
        // Hash the provided password with bcrypt
        return bcryptHash(password, salt);
    });
}

// To Do : add event listeners to act on emitted changed events

Driver = mainBookshelf.Model.extend({

    tableName: 'Drivers',

    organization: function organizations() {
        return this.belongsTo('Organization');
    },

    jobs: function jobs() {
        return this.hasMany('Job');
    },

    stops: function stops() {
        return this.hasMany('Stop');
    },

    findOne: function findOne() {
    // return a Driver based on Driver id
    },
/**
    findAll: function findAll() {
    // return all Drivers in organization and filter values
    	var self = this;
    	// where organization is the key
    	self.where().fetch()
    		.then(function(Drivers) {
    			res.json(Drivers);
    		})
    },

    create: function createDriver() {
    // create Driver with reference to organization
    // return created Driver
    },

    update: function updateDriver() {
    // return updated Driver and emit event
    // 
    	var self = this;
    	self.forge({

    	}).save
    },
**/






    ///////////////////////////////////////////////////////////
    /// ######  Figure out data util and other methods later 

    emitChange: function emitChange(event) {
        events.emit('Driver' + '.' + event, this);
    },

    initialize: function initialize() {
        mainBookshelf.Model.prototype.initialize.apply(this, arguments);

        this.on('created', function onCreated(model) {
            model.emitChange('added');

            // offDuty is the default state, so if onDuty isn't provided, this will be offDuty Driver
            if (!model.get('onDuty') || _.contains(activeStates, model.get('onDuty'))) {
                model.emitChange('onDuty');
            }
        });
        this.on('updated', function onUpdated(model) {
            model.statusChanging = model.get('onDuty') !== model.updated('onDuty');
            model.isActive = _.contains(activeStates, model.get('onDuty'));

            if (model.statusChanging) {
                model.emitChange(model.onDuty ? 'onDuty' : 'offDuty');
            } else {
                if (model.isActive) {
                    model.emitChange('activated.edited');
                }
            }

            model.emitChange('edited');
        });
        this.on('destroyed', function onDestroyed(model) {
            if (_.contains(activeStates, model.previous('status'))) {
                model.emitChange('deactivated');
            }

            model.emitChange('deleted');
        });
    },

    saving: function saving(newPage, attr, options) {
        /*jshint unused:false*/

        var self = this;

        mainBookshelf.Model.prototype.saving.apply(this, arguments);

        if (this.hasChanged('slug') || !this.get('slug')) {
            // Generating a slug requires a db call to look for conflicting slugs
            return mainBookshelf.Model.generateSlug(Driver, this.get('slug') || this.get('name'),
                {status: 'all', transacting: options.transacting, shortSlug: !this.get('slug')})
                .then(function then(slug) {
                    self.set({slug: slug});
                });
        }
    },

    // Get the Driver from the options object
    contextUser: function contextUser(options) {
        // Default to context user
        if (options.context && options.context.user) {
            return options.context.user;
            // Other wise use the internal override
        } else if (options.context && options.context.internal) {
            return 1;
            // This is the user object, so try using this user's id
        } else if (this.get('id')) {
            return this.get('id');
        } else {
            errors.logAndThrowError(new errors.NotFoundError(console.log('errors.models.user.missingContext')));
        }
    },

    toJSON: function toJSON(options) {
        options = options || {};

        var attrs = mainBookshelf.Model.prototype.toJSON.call(this, options);
        // remove password hash for security reasons
        delete attrs.password;

        if (!options || !options.context || (!options.context.user && !options.context.internal)) {
            delete attrs.email;
        }

        return attrs;
    },


    /**
     * @deprecated in favour of filter
     */
    processOptions: function processOptions(options) {
        if (!options.status) {
            return options;
        }

        // This is the only place that 'options.where' is set now
        options.where = {statements: []};

        var allStates = activeStates.concat(invitedStates),
            value;

        // Filter on the status.  A status of 'all' translates to no filter since we want all statuses
        if (options.status !== 'all') {
            // make sure that status is valid
            options.status = allStates.indexOf(options.status) > -1 ? options.status : 'active';
        }

        if (options.status === 'active') {
            value = activeStates;
        } else if (options.status === 'invited') {
            value = invitedStates;
        } else if (options.status === 'all') {
            value = allStates;
        } else {
            value = options.status;
        }

        options.where.statements.push({prop: 'status', op: 'IN', value: value});
        delete options.status;

        return options;
    },


    /**
     * ### Find One
     * @extends mainBookshelf.Model.findOne to include roles
     * **See:** [mainBookshelf.Model.findOne](base.js.html#Find%20One)
     */
    findOne: function findOne(data, options) {
        var query,
            status,
            optInc,
            lookupRole = data.role;

        data = _.defaults(data || {}, {
            status: 'active'
        });

        status = data.status;
        delete data.status;

        options = options || {};
        optInc = options.include;
        options.withRelated = _.union(options.withRelated, options.include);
        data = this.filterData(data);

        // Support finding by role
        if (lookupRole) {
            options.withRelated = _.union(options.withRelated, ['roles']);
            options.include = _.union(options.include, ['roles']);

            query = this.forge(data, {include: options.include});

            query.query('join', 'roles_Drivers', 'Drivers.id', '=', 'roles_Drivers.id');
            query.query('join', 'roles', 'roles_Drivers.role_id', '=', 'roles.id');
            query.query('where', 'roles.name', '=', lookupRole);
        } else {
            // We pass include to forge so that toJSON has access
            query = this.forge(data, {include: options.include});
        }

        if (status === 'active') {
            query.query('whereIn', 'status', activeStates);
        } else if (status === 'invited') {
            query.query('whereIn', 'status', invitedStates);
        } else if (status !== 'all') {
            query.query('where', {status: options.status});
        }

        options = this.filterOptions(options, 'findOne');
        delete options.include;
        options.include = optInc;

        return query.fetch(options);
    },

    /**
     * ### Edit
     * @extends mainBookshelf.Model.edit to handle returning the full object
     * **See:** [mainBookshelf.Model.edit](base.js.html#edit)
     */
    edit: function edit(data, options) {
        var self = this,
            roleId;

        if (data.roles && data.roles.length > 1) {
            return Promise.reject(
                new errors.ValidationError(i18n.t('errors.models.user.onlyOneRolePerDriversupported'))
            );
        }

        options = options || {};
        options.withRelated = _.union(options.withRelated, options.include);

        return mainBookshelf.Model.edit.call(this, data, options).then(function then(user) {
            if (!data.roles) {
                return user;
            }

            roleId = parseInt(data.roles[0].id || data.roles[0], 10);

            return user.roles().fetch().then(function then(roles) {
                // return if the role is already assigned
                if (roles.models[0].id === roleId) {
                    return;
                }
                return mainBookshelf.model('Role').findOne({id: roleId});
            }).then(function then(roleToAssign) {
                if (roleToAssign && roleToAssign.get('name') === 'Owner') {
                    return Promise.reject(
                        new errors.ValidationError(i18n.t('errors.models.user.methodDoesNotSupportOwnerRole'))
                    );
                } else {
                    // assign all other roles
                    return user.roles().updatePivot({role_id: roleId});
                }
            }).then(function then() {
                options.status = 'all';
                return self.findOne({id: user.id}, options);
            });
        });
    },

    /**
     * ## Add
     * Naive user add
     * Hashes the password provided before saving to the database.
     *
     * @param {object} data
     * @param {object} options
     * @extends mainBookshelf.Model.add to manage all aspects of user signup
     * **See:** [mainBookshelf.Model.add](base.js.html#Add)
     */
    add: function add(data, options) {
        var self = this,
            driverData = this.filterData(data),
            roles;

        options = this.filterOptions(options, 'add');
        options.withRelated = _.union(options.withRelated, options.include);

        // check for too many roles
        if (data.roles && data.roles.length > 1) {
            return Promise.reject(new errors.ValidationError(i18n.t('errors.models.user.onlyOneRolePerDriversupported')));
        }

        if (!validatePasswordLength(driverData.password)) {
            return Promise.reject(new errors.ValidationError(i18n.t('errors.models.user.passwordDoesNotComplyLength')));
        }

        function getAuthorRole() {
            return mainBookshelf.model('Role').findOne({name: 'Author'}, _.pick(options, 'transacting')).then(function then(authorRole) {
                return [authorRole.get('id')];
            });
        }

        roles = data.roles || getAuthorRole();
        delete data.roles;

        return generatePasswordHash(driverData.password).then(function then(hash) {
            // Assign the hashed password
            DriverData.password = hash;
            // LookupGravatar
            return self.gravatarLookup(driverData);
        }).then(function then(driverData) {
            // Save the user with the hashed password
            return mainBookshelf.Model.add.call(self, driverData, options);
        }).then(function then(addedDriver) {
            // Assign the driverData to our created user so we can pass it back
            DriverData = addedDriver;
            // if we are given a "role" object, only pass in the role ID in place of the full object
            return Promise.resolve(roles).then(function then(roles) {
                roles = _.map(roles, function mapper(role) {
                    if (_.isString(role)) {
                        return parseInt(role, 10);
                    } else if (_.isNumber(role)) {
                        return role;
                    } else {
                        return parseInt(role.id, 10);
                    }
                });

                return addedDriver.roles().attach(roles, options);
            });
        }).then(function then() {
            // find and return the added user
            return self.findOne({id: DriverData.id, status: 'all'}, options);
        });
    },

    setup: function setup(data, options) {
        var self = this,
            driverData = this.filterData(data);

        if (!validatePasswordLength(driverData.password)) {
            return Promise.reject(new errors.ValidationError(console.log('errors.models.user.passwordDoesNotComplyLength')));
        }

        options = this.filterOptions(options, 'setup');
        options.withRelated = _.union(options.withRelated, options.include);
        options.shortSlug = true;

        return generatePasswordHash(data.password).then(function then(hash) {
            // Assign the hashed password
            driverData.password = hash;

            return Promise.join(self.gravatarLookup(driverData),
                                mainBookshelf.Model.generateSlug.call(this, Driver, driverData.name, options));
        }).then(function then(results) {
            driverData = results[0];
            driverData.slug = results[1];

            return self.edit.call(self, driverData, options);
        });
    },

    // Finds the user by phone, and checks the password
    check: function check(object) {
        var self = this,
            s;
        return this.getByEmail(object.email).then(function then(user) {
            if (!user) {
                return Promise.reject(new errors.NotFoundError(i18n.t('errors.models.user.noUserWithEnteredEmailAddr')));
            }
            if (user.get('status') === 'invited' || user.get('status') === 'invited-pending' ||
                    user.get('status') === 'inactive'
                ) {
                return Promise.reject(new errors.NoPermissionError(i18n.t('errors.models.user.userisInactive')));
            }
            if (user.get('status') !== 'locked') {
                return bcryptCompare(object.password, user.get('password')).then(function then(matched) {
                    if (!matched) {
                        return Promise.resolve(self.setWarning(user, {validate: false})).then(function then(remaining) {
                            s = (remaining > 1) ? 's' : '';
                            return Promise.reject(new errors.UnauthorizedError(i18n.t('errors.models.user.incorrectPasswordAttempts', {remaining: remaining, s: s})));

                            // Use comma structure, not .catch, because we don't want to catch incorrect passwords
                        }, function handleError(error) {
                            // If we get a validation or other error during this save, catch it and log it, but don't
                            // cause a login error because of it. The user validation is not important here.
                            errors.logError(
                                error,
                                i18n.t('errors.models.user.userUpdateError.context'),
                                i18n.t('errors.models.user.userUpdateError.help')
                            );
                            return Promise.reject(new errors.UnauthorizedError(i18n.t('errors.models.user.incorrectPassword')));
                        });
                    }

                    return Promise.resolve(user.set({status: 'active', last_login: new Date()}).save({validate: false}))
                        .catch(function handleError(error) {
                            // If we get a validation or other error during this save, catch it and log it, but don't
                            // cause a login error because of it. The user validation is not important here.
                            errors.logError(
                                error,
                                i18n.t('errors.models.user.userUpdateError.context'),
                                i18n.t('errors.models.user.userUpdateError.help')
                            );
                            return user;
                        });
                }, errors.logAndThrowError);
            }
            return Promise.reject(new errors.NoPermissionError(
                i18n.t('errors.models.user.accountLocked')));
        }, function handleError(error) {
            if (error.message === 'NotFound' || error.message === 'EmptyResponse') {
                return Promise.reject(new errors.NotFoundError(i18n.t('errors.models.user.noUserWithEnteredEmailAddr')));
            }

            return Promise.reject(error);
        });
    },

    /**
     * Naive change password method
     * @param {Object} object
     * @param {Object} options
     */
    changePassword: function changePassword(object, options) {
        var self = this,
            newPassword = object.newPassword,
            ne2Password = object.ne2Password,
            userId = object.user_id,
            oldPassword = object.oldPassword,
            user;

        if (newPassword !== ne2Password) {
            return Promise.reject(new errors.ValidationError(i18n.t('errors.models.user.newPasswordsDoNotMatch')));
        }

        if (userId === options.context.user && _.isEmpty(oldPassword)) {
            return Promise.reject(new errors.ValidationError(i18n.t('errors.models.user.passwordRequiredForOperation')));
        }

        if (!validatePasswordLength(newPassword)) {
            return Promise.reject(new errors.ValidationError(i18n.t('errors.models.user.passwordDoesNotComplyLength')));
        }

        return self.forge({id: userId}).fetch({require: true}).then(function then(_user) {
            user = _user;
            if (userId === options.context.user) {
                return bcryptCompare(oldPassword, user.get('password'));
            }
            // if user is admin, password isn't compared
            return true;
        }).then(function then(matched) {
            if (!matched) {
                return Promise.reject(new errors.ValidationError(i18n.t('errors.models.user.incorrectPassword')));
            }

            return generatePasswordHash(newPassword);
        }).then(function then(hash) {
            return user.save({password: hash});
        });
    },

    generateResetToken: function generateResetToken(email, expires, dbHash) {
        return this.getByEmail(email).then(function then(foundUser) {
            if (!foundUser) {
                return Promise.reject(new errors.NotFoundError(i18n.t('errors.models.user.noUserWithEnteredEmailAddr')));
            }

            var hash = crypto.createHash('sha256'),
                text = '';

            // Token:
            // BASE64(TIMESTAMP + email + HASH(TIMESTAMP + email + oldPasswordHash + dbHash ))
            hash.update(String(expires));
            hash.update(email.toLocaleLowerCase());
            hash.update(foundUser.get('password'));
            hash.update(String(dbHash));

            text += [expires, email, hash.digest('base64')].join('|');
            return new Buffer(text).toString('base64');
        });
    },

    validateToken: function validateToken(token, dbHash) {
        /*jslint bitwise:true*/
        // TODO: Is there a chance the use of ascii here will cause problems if oldPassword has weird characters?
        var tokenText = new Buffer(token, 'base64').toString('ascii'),
            parts,
            expires,
            email;

        parts = tokenText.split('|');

        // Check if invalid structure
        if (!parts || parts.length !== 3) {
            return Promise.reject(new errors.BadRequestError(i18n.t('errors.models.user.invalidTokenStructure')));
        }

        expires = parseInt(parts[0], 10);
        email = parts[1];

        if (isNaN(expires)) {
            return Promise.reject(new errors.BadRequestError(i18n.t('errors.models.user.invalidTokenExpiration')));
        }

        // Check if token is expired to prevent replay attacks
        if (expires < Date.now()) {
            return Promise.reject(new errors.ValidationError(i18n.t('errors.models.user.expiredToken')));
        }

        // to prevent brute force attempts to reset the password the combination of email+expires is only allowed for
        // 10 attempts
        if (tokenSecurity[email + '+' + expires] && tokenSecurity[email + '+' + expires].count >= 10) {
            return Promise.reject(new errors.NoPermissionError(i18n.t('errors.models.user.tokenLocked')));
        }

        return this.generateResetToken(email, expires, dbHash).then(function then(generatedToken) {
            // Check for matching tokens with timing independent comparison
            var diff = 0,
                i;

            // check if the token length is correct
            if (token.length !== generatedToken.length) {
                diff = 1;
            }

            for (i = token.length - 1; i >= 0; i = i - 1) {
                diff |= token.charCodeAt(i) ^ generatedToken.charCodeAt(i);
            }

            if (diff === 0) {
                return email;
            }

            // increase the count for email+expires for each failed attempt
            tokenSecurity[email + '+' + expires] = {
                count: tokenSecurity[email + '+' + expires] ? tokenSecurity[email + '+' + expires].count + 1 : 1
            };
            return Promise.reject(new errors.BadRequestError(i18n.t('errors.models.user.invalidToken')));
        });
    },

    resetPassword: function resetPassword(options) {
        var self = this,
            token = options.token,
            newPassword = options.newPassword,
            ne2Password = options.ne2Password,
            dbHash = options.dbHash;

        if (newPassword !== ne2Password) {
            return Promise.reject(new errors.ValidationError(i18n.t('errors.models.user.newPasswordsDoNotMatch')));
        }

        if (!validatePasswordLength(newPassword)) {
            return Promise.reject(new errors.ValidationError(i18n.t('errors.models.user.passwordDoesNotComplyLength')));
        }

        // Validate the token; returns the email address from token
        return self.validateToken(utils.decodeBase64URLsafe(token), dbHash).then(function then(email) {
            // Fetch the user by email, and hash the password at the same time.
            return Promise.join(
                self.getByEmail(email),
                generatePasswordHash(newPassword)
            );
        }).then(function then(results) {
            if (!results[0]) {
                return Promise.reject(new errors.NotFoundError(i18n.t('errors.models.user.userNotFound')));
            }

            // Update the user with the new password hash
            var foundUser = results[0],
                passwordHash = results[1];

            return foundUser.save({password: passwordHash, status: 'active'});
        });
    },

    // TO DO : CHANGE TO GET BY PHONE
    // Get the user by email address, enforces case insensitivity rejects if the user is not found
    // When multi-user support is added, email addresses must be deduplicated with case insensitivity, so that
    // joe@bloggs.com and JOE@BLOGGS.COM cannot be created as two separate Drivers.
    getByEmail: function getByEmail(email, options) {
        options = options || {};
        // We fetch all Drivers and process them in JS as there is no easy way to make this query across all DBs
        // Although they all support `lower()`, sqlite can't case transform unicode characters
        // This is somewhat mute, as validator.isEmail() also doesn't support unicode, but this is much easier / more
        // likely to be fixed in the near future.
        options.require = true;

        return Drivers.forge(options).fetch(options).then(function then(Drivers) {
            var userWithEmail = Drivers.find(function findUser(user) {
                return user.get('email').toLowerCase() === email.toLowerCase();
            });
            if (userWithEmail) {
                return userWithEmail;
            }
        });
    }
});

Drivers = mainBookshelf.Collection.extend({
    model: Drivers
});

module.exports = {
    Driver: mainBookshelf.model('Driver', Driver),
    Drivers: mainBookshelf.collection('Drivers', Drivers)
};


