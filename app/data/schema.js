'use strict';

// Schema to migrate up fresh database

var db = {
        workers: {
            id: {type: 'increments', nullable: false, primary: true},
            uuid: {type: 'string', maxlength: 36, nullable: false, validations: {isUUID: true}},
            name: {type: 'string', maxlength: 150, nullable: false},
            status: {type: 'string', maxlength: 150, nullable: false, defaultTo: 'active'},
            onDuty: {type: 'string', maxlength: 150, nullable: false, defaultTo: 'active'},
            longitude: {type: 'decimal', precision: 9, scale: 6},
            latitude: {type: 'decimal', precision: 9, scale: 6},
            organization_id: {type: 'integer', nullable: false, unsigned: true, references: 'organization.id'}, 
            meta_description: {type: 'string', maxlength: 200, nullable: true},
            created_at: {type: 'dateTime', nullable: false},
            created_by: {type: 'integer', nullable: false},
            updated_at: {type: 'dateTime', nullable: true},
            updated_by: {type: 'integer', nullable: true}
        },
        organizations: {
            id: {type: 'increments', nullable: false, primary: true},
            uuid: {type: 'string', maxlength: 36, nullable: false, validations: {isUUID: true}},
            name: {type: 'string', maxlength: 150, nullable: false},
            email: {type: 'string', maxlength: 254, nullable: false, unique: true, validations: {isEmail: true}},
            website: {type: 'text', maxlength: 2000, nullable: true, validations: {isEmptyOrURL: true}},
            location: {type: 'text', maxlength: 65535, nullable: true},
            status: {type: 'string', maxlength: 150, nullable: false, defaultTo: 'active'},
            meta_description: {type: 'string', maxlength: 200, nullable: true},
        },
        jobs: {
            id: {type: 'increments', nullable: false, primary: true},
            uuid: {type: 'string', maxlength: 36, nullable: false, validations: {isUUID: true}},
            name: {type: 'string', maxlength: 150, nullable: false},
            worker_id: {type: 'integer', nullable: false, unsigned: true, references: 'posts.id'},
            description: {type: 'string', maxlength: 200, nullable: true},
            type: {type: 'string', maxlength: 36, nullable: false}, // delivery or service
            notes: {type: 'text', maxlength: 65535, nullable: true},
            created_at: {type: 'dateTime',  nullable: false},
            created_by: {type: 'integer',  nullable: false},
            updated_at: {type: 'dateTime',  nullable: true},
            updated_by: {type: 'integer',  nullable: true}
        },
        admins: {
            id: {type: 'increments', nullable: false, primary: true},
            uuid: {type: 'string', maxlength: 36, nullable: false, validations: {isUUID: true}},
            last_login: {type: 'dateTime', nullable: true}
        },
        stops: {
            id: {type: 'increments', nullable: false, primary: true},
            uuid: {type: 'string', maxlength: 36, nullable: false, validations: {isUUID: true}},
            status: {type: 'string', maxlength: 150, nullable: false, defaultTo: 'active'},
            type: {type: 'string', maxlength: 36, nullable: false}, // delivery or service
            longitude: {type: 'decimal', precision: 9, scale: 6},
            latitude: {type: 'decimal', precision: 9, scale: 6},
            address: {type: 'text', maxlength: 2000, nullable: false},
            job_id:
            worker_id:
            object_type: {type: 'string', maxlength: 150, nullable: false},
            action_type: {type: 'string', maxlength: 150, nullable: false},
            object_id: {type: 'integer', nullable: true},
            created_at: {type: 'dateTime', nullable: false},
            created_by: {type: 'integer', nullable: true},
            updated_at: {type: 'dateTime', nullable: true},
            updated_by: {type: 'integer', nullable: true},
            started_at: {type: 'dateTime', nullable: true},
            completed_at: {type: 'dateTime', nullable: true}
        },
        accounts: {
            id: {type: 'increments', nullable: false, primary: true},
            user_id: {type: 'integer', nullable: false},
            permission_id: {type: 'integer', nullable: false}
        },
        permissions_roles: {
            id: {type: 'increments', nullable: false, primary: true},
            role_id: {type: 'integer', nullable: false},
            permission_id: {type: 'integer', nullable: false}
        },
        permissions_apps: {
            id: {type: 'increments', nullable: false, primary: true},
            app_id: {type: 'integer', nullable: false},
            permission_id: {type: 'integer', nullable: false}
        },
        settings: {
            id: {type: 'increments', nullable: false, primary: true},
            uuid: {type: 'string', maxlength: 36, nullable: false, validations: {isUUID: true}},
            key: {type: 'string', maxlength: 150, nullable: false, unique: true},
            value: {type: 'text', maxlength: 65535, nullable: true},
            type: {type: 'string', maxlength: 150, nullable: false, defaultTo: 'core', validations: {isIn: [['core', 'blog', 'theme', 'app', 'plugin', 'private']]}},
            created_at: {type: 'dateTime', nullable: false},
            created_by: {type: 'integer', nullable: false},
            updated_at: {type: 'dateTime', nullable: true},
            updated_by: {type: 'integer', nullable: true}
        },
        tags: {
            id: {type: 'increments', nullable: false, primary: true},
            uuid: {type: 'string', maxlength: 36, nullable: false, validations: {isUUID: true}},
            name: {type: 'string', maxlength: 150, nullable: false, validations: {matches: /^([^,]|$)/}},
            slug: {type: 'string', maxlength: 150, nullable: false, unique: true},
            description: {type: 'string', maxlength: 200, nullable: true},
            image: {type: 'text', maxlength: 2000, nullable: true},
            hidden: {type: 'bool', nullable: false, defaultTo: false, validations: {isIn: [[0, 1, false, true]]}},
            parent_id: {type: 'integer', nullable: true},
            meta_title: {type: 'string', maxlength: 150, nullable: true},
            meta_description: {type: 'string', maxlength: 200, nullable: true},
            created_at: {type: 'dateTime', nullable: false},
            created_by: {type: 'integer', nullable: false},
            updated_at: {type: 'dateTime', nullable: true},
            updated_by: {type: 'integer', nullable: true}
        },
        posts_tags: {
            id: {type: 'increments', nullable: false, primary: true},
            post_id: {type: 'integer', nullable: false, unsigned: true, references: 'posts.id'},
            tag_id: {type: 'integer', nullable: false, unsigned: true, references: 'tags.id'},
            sort_order: {type: 'integer',  nullable: false, unsigned: true, defaultTo: 0}
        },
        accesstokens: {
            id: {type: 'increments', nullable: false, primary: true},
            token: {type: 'string', nullable: false, unique: true},
            user_id: {type: 'integer', nullable: false, unsigned: true, references: 'users.id'},
            client_id: {type: 'integer', nullable: false, unsigned: true, references: 'clients.id'},
            expires: {type: 'bigInteger', nullable: false}
        },
        refreshtokens: {
            id: {type: 'increments', nullable: false, primary: true},
            token: {type: 'string', nullable: false, unique: true},
            user_id: {type: 'integer', nullable: false, unsigned: true, references: 'users.id'},
            client_id: {type: 'integer', nullable: false, unsigned: true, references: 'clients.id'},
            expires: {type: 'bigInteger', nullable: false}
        }
    };

function isPost(jsonData) {
    return jsonData.hasOwnProperty('html') && jsonData.hasOwnProperty('markdown') &&
           jsonData.hasOwnProperty('title') && jsonData.hasOwnProperty('slug');
}

function isTag(jsonData) {
    return jsonData.hasOwnProperty('name') && jsonData.hasOwnProperty('slug') &&
        jsonData.hasOwnProperty('description') && jsonData.hasOwnProperty('parent');
}

function isUser(jsonData) {
    return jsonData.hasOwnProperty('bio') && jsonData.hasOwnProperty('website') &&
        jsonData.hasOwnProperty('status') && jsonData.hasOwnProperty('location');
}

function isNav(jsonData) {
    return jsonData.hasOwnProperty('label') && jsonData.hasOwnProperty('url') &&
        jsonData.hasOwnProperty('slug') && jsonData.hasOwnProperty('current');
}

module.exports.tables = db;
module.exports.checks = {
    isPost: isPost,
    isTag: isTag,
    isUser: isUser,
    isNav: isNav
};