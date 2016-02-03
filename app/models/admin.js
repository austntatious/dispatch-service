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
    validation     = require('../data/validation'),
    config         = require('../config'),
    events         = require('../events'),
    i18n           = require('../i18n'),

    bcryptGenSalt  = Promise.promisify(bcrypt.genSalt),
    bcryptHash     = Promise.promisify(bcrypt.hash),
    bcryptCompare  = Promise.promisify(bcrypt.compare),

    tokenSecurity  = {},
    activeStates   = ['active', 'warn-1', 'warn-2', 'warn-3', 'warn-4', 'locked'],
    invitedStates  = ['invited', 'invited-pending'],
    Admin,
    Admins;

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

Admin = mainBookshelf.Model.extend({

    // ## Relations - To Do: add roles and priviledges
    organizations: function organizations() {
        return this.hasMany('Organization');
    },

    // Finds the user by email, and checks the password
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

    transferOwnership: function transferOwnership(object, options) {
        var ownerRole,
            contextUser;

        return Promise.join(ghostBookshelf.model('Role').findOne({name: 'Owner'}),
                            User.findOne({id: options.context.user}, {include: ['roles']}))
        .then(function then(results) {
            ownerRole = results[0];
            contextUser = results[1];

            // check if user has the owner role
            var currentRoles = contextUser.toJSON(options).roles;
            if (!_.any(currentRoles, {id: ownerRole.id})) {
                return Promise.reject(new errors.NoPermissionError(i18n.t('errors.models.user.onlyOwnerCanTransferOwnerRole')));
            }

            return Promise.join(ghostBookshelf.model('Role').findOne({name: 'Administrator'}),
                                User.findOne({id: object.id}, {include: ['roles']}));
        }).then(function then(results) {
            var adminRole = results[0],
                user = results[1],
                currentRoles = user.toJSON(options).roles;

            if (!_.any(currentRoles, {id: adminRole.id})) {
                return Promise.reject(new errors.ValidationError('errors.models.user.onlyAdmCanBeAssignedOwnerRole'));
            }

            // convert owner to admin
            return Promise.join(contextUser.roles().updatePivot({role_id: adminRole.id}),
                                user.roles().updatePivot({role_id: ownerRole.id}),
                                user.id);
        }).then(function then(results) {
            return Users.forge()
                .query('whereIn', 'id', [contextUser.id, results[2]])
                .fetch({withRelated: ['roles']});
        }).then(function then(users) {
            options.include = ['roles'];
            return users.toJSON(options);
        });
    },


    // Get the user by email address, enforces case insensitivity rejects if the user is not found
    // When multi-user support is added, email addresses must be deduplicated with case insensitivity, so that
    // joe@bloggs.com and JOE@BLOGGS.COM cannot be created as two separate users.
    getByEmail: function getByEmail(email, options) {
        options = options || {};
        
        // TO DO : FIX THIS AND MAKE IT EASIER **
        // We fetch all admins and process them in JS as there is no easy way to make this query across all DBs
        // Although they all support `lower()`, sqlite can't case transform unicode characters
        // This is somewhat mute, as validator.isEmail() also doesn't support unicode, but this is much easier / more
        // likely to be fixed in the near future.
        options.require = true;

        return Admins.forge(options).fetch(options).then(function then(admins) {
            var userWithEmail = admins.find(function findUser(admin) {
                return admin.get('email').toLowerCase() === email.toLowerCase();
            });
            if (userWithEmail) {
                return userWithEmail;
            }
        });
    }
});

Admins = mainBookshelf.Collection.extend({
    model: Admin
});

module.exports = {
    Admin: mainBookshelf.model('Admin', Admin),
    Admins: mainBookshelf.collection('Admins', Admins)
};