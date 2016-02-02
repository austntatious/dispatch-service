'use strict';

// Schema to migrate up fresh database
// To do: add index on tables
var db = {
        workers: {
            id: {type: 'serial', nullable: false, primary: true},
            uuid: {type: 'string', maxlength: 36, nullable: false, validations: {isUUID: true}},
            name: {type: 'string', maxlength: 150, nullable: false},
            status: {type: 'string', maxlength: 150, nullable: false, defaultTo: 'active'},
            onDuty: {type: 'bool', nullable: false, defaultTo: false},
            longitude: {type: 'decimal', precision: 9, scale: 6, nullable: true},
            latitude: {type: 'decimal', precision: 8, scale: 6, nullable: true},
            password: {type: 'string', maxlength: 60, nullable: false},
            organization_id: {type: 'integer', nullable: false, unsigned: true, references: 'organization.id'}, 
            meta_description: {type: 'string', maxlength: 200, nullable: true},
            created_at: {type: 'dateTime', nullable: false},
            created_by: {type: 'integer', nullable: false},
            updated_at: {type: 'dateTime', nullable: true},
            updated_by: {type: 'integer', nullable: true}
        },
        organizations: {
            id: {type: 'serial', nullable: false, primary: true},
            uuid: {type: 'string', maxlength: 36, nullable: false, validations: {isUUID: true}},
            name: {type: 'string', maxlength: 150, nullable: false},
            email: {type: 'string', maxlength: 254, nullable: false, unique: true, validations: {isEmail: true}},
            website: {type: 'text', maxlength: 2000, nullable: true, validations: {isEmptyOrURL: true}},
            location: {type: 'text', maxlength: 65535, nullable: true},
            status: {type: 'string', maxlength: 150, nullable: false, defaultTo: 'active'}
        },
        jobs: {
            id: {type: 'serial', nullable: false, primary: true},
            uuid: {type: 'string', maxlength: 36, nullable: false, validations: {isUUID: true}},
            name: {type: 'string', maxlength: 150, nullable: false},
            worker_id: {type: 'integer', nullable: false, unsigned: true, references: 'worker.id'},
            organization_id: {type: 'integer', nullable: false, unsigned: true, references: 'organization.id'},
            description: {type: 'string', maxlength: 200, nullable: true},
            type: {type: 'string', maxlength: 36, nullable: false}, // delivery or service
            notes: {type: 'text', maxlength: 65535, nullable: true},
            created_at: {type: 'dateTime',  nullable: false},
            created_by: {type: 'integer',  nullable: false},
            updated_at: {type: 'dateTime',  nullable: true},
            updated_by: {type: 'integer',  nullable: true},
            assigned: {type: 'bool', nullable: false, defaultTo: false}
        },
        admins: {
            id: {type: 'serial', nullable: false, primary: true},
            uuid: {type: 'string', maxlength: 36, nullable: false, validations: {isUUID: true}},
            name: {type: 'string', maxlength: 150, nullable: false},
            status: {type: 'string', maxlength: 150, nullable: false, defaultTo: 'active'},
            password: {type: 'string', maxlength: 60, nullable: false},
            organization_id: {type: 'integer', nullable: false, unsigned: true, references: 'organization.id'},
            last_login: {type: 'dateTime', nullable: true},
            auto_assign: {type: 'bool', nullable: false, defaultTo: false}
        },
        stops: {
            id: {type: 'serial', nullable: false, primary: true},
            uuid: {type: 'string', maxlength: 36, nullable: false, validations: {isUUID: true}},
            status: {type: 'string', maxlength: 150, nullable: false, defaultTo: 'active'}, // pending, cancelled
            type: {type: 'string', maxlength: 36, nullable: false}, // delivery or service
            longitude: {type: 'decimal', precision: 9, scale: 6},
            latitude: {type: 'decimal', precision: 8, scale: 6},
            address: {type: 'text', maxlength: 2000, nullable: false},
            job_id: {type: 'integer', nullable: false, unsigned: true, references: 'job.id'},
            worker_id: {type: 'integer', nullable: false, unsigned: true, references: 'worker.id'},
            created_at: {type: 'dateTime', nullable: false},
            created_by: {type: 'integer', nullable: true},
            updated_at: {type: 'dateTime', nullable: true},
            updated_by: {type: 'integer', nullable: true},
            started_at: {type: 'dateTime', nullable: true},
            completed_at: {type: 'dateTime', nullable: true},
            start_by: {type: 'dateTime', nullable: true},
            complete_by: {type: 'dateTime', nullable: true}
        },
        accounts: {
            id: {type: 'serial', nullable: false, primary: true},
            user_id: {type: 'integer', nullable: false},
            permission_id: {type: 'integer', nullable: false}
        },
        tags: {
            id: {type: 'serial', nullable: false, primary: true},
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
            id: {type: 'serial', nullable: false, primary: true},
            post_id: {type: 'integer', nullable: false, unsigned: true, references: 'posts.id'},
            tag_id: {type: 'integer', nullable: false, unsigned: true, references: 'tags.id'},
            sort_order: {type: 'integer',  nullable: false, unsigned: true, defaultTo: 0}
        },
        accesstokens: {
            id: {type: 'serial', nullable: false, primary: true},
            token: {type: 'string', nullable: false, unique: true},
            user_id: {type: 'integer', nullable: false, unsigned: true, references: 'users.id'},
            client_id: {type: 'integer', nullable: false, unsigned: true, references: 'clients.id'},
            expires: {type: 'bigInteger', nullable: false}
        },
        refreshtokens: {
            id: {type: 'serial', nullable: false, primary: true},
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