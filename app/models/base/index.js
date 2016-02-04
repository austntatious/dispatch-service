// # Base Model
// This is the model from which all other Ghost models extend. The model is based on Bookshelf.Model, and provides
// several basic behaviours such as UUIDs, as well as a set of Data methods for accessing information from the database.
//
// The models are internal to Ghost, only the API and some internal functions such as migration and import/export
// accesses the models directly. All other parts of Ghost, including the blog frontend, admin UI, and apps are only
// allowed to access data via the API.
var _          = require('lodash'),
    bookshelf  = require('bookshelf'),
    knexInstance= require('../../../config/db'),
    moment      = require('moment'),
    Promise     = require('bluebird'),
    sanitizer   = require('validator').sanitize,
    schema      = require('../../data/schema'),
    uuid        = require('node-uuid'),

    mainBookshelf,
    proto;

// ### mainBookshelf
// Initializes a new Bookshelf instance called mainBookshelf, for reference elsewhere
mainBookshelf = bookshelf(knexInstance.database);

// Load the Bookshelf registry plugin, which helps us avoid circular dependencies
mainBookshelf.plugin('registry');


// Load the Ghost include count plugin, which allows for the inclusion of cross-table counts
// mainBookshelf.plugin(plugins.includeCount);

// Cache an instance of the base model prototype
proto = mainBookshelf.Model.prototype;

// ## mainBookshelf.Model
// The Base Model which other Model objects will inherit from,
// including some convenience functions as static properties on the model.
mainBookshelf.Model = mainBookshelf.Model.extend({
    // Bookshelf `hasTimestamps` - handles created_at and updated_at properties
    hasTimestamps: true,

    // option handling - get permitted attributes from /data/schema.js, where the DB schema is defined
    permittedAttributes: function permittedAttributes() {
        return _.keys(schema.tables[this.tableName]);
    },

    // Bookshelf `defaults` - default values setup on every model creation
    defaults: function defaults() {
        return {
            uuid: uuid.v4()
        };
    },

    // ## Model Data Functions

    /**
     * ### Find All
     * Naive find all fetches all the data for a particular model
     * @param {Object} options (optional)
     * @return {Promise(mainBookshelf.Collection)} Collection of all Models
     */
    findAll: function findAll(options) {
        options = this.filterOptions(options, 'findAll');
        options.withRelated = _.union(options.withRelated, options.include);
        return this.forge().fetchAll(options).then(function then(result) {
            if (options.include) {
                _.each(result.models, function each(item) {
                    item.include = options.include;
                });
            }
            return result;
        });
    },

    /**
     * ### Find One
     * Naive find one where data determines what to match on
     * @param {Object} data
     * @param {Object} options (optional)
     * @return {Promise(mainBookshelf.Model)} Single Model
     */
    findOne: function findOne(data, options) {
        data = this.filterData(data);
        options = this.filterOptions(options, 'findOne');
        // We pass include to forge so that toJSON has access
        return this.forge(data, {include: options.include}).fetch(options);
    },

    /**
     * ### Edit
     * Naive edit
     * @param {Object} data
     * @param {Object} options (optional)
     * @return {Promise(mainBookshelf.Model)} Edited Model
     */
    edit: function edit(data, options) {
        var id = options.id;
        data = this.filterData(data);
        options = this.filterOptions(options, 'edit');

        return this.forge({id: id}).fetch(options).then(function then(object) {
            if (object) {
                return object.save(data, options);
            }
        });
    },

    /**
     * ### Add
     * Naive add
     * @param {Object} data
     * @param {Object} options (optional)
     * @return {Promise(mainBookshelf.Model)} Newly Added Model
     */
    add: function add(data, options) {
        // todo: add filter for data and options
        var model = this.forge(data);
        return model.save(null, options);
    },

    /**
     * ### Destroy
     * Naive destroy
     * @param {Object} options (optional)
     * @return {Promise(mainBookshelf.Model)} Empty Model
     */
    destroy: function destroy(options) {
        var id = options.id;
        options = this.filterOptions(options, 'destroy');

        // Fetch the object before destroying it, so that the changed data is available to events
        return this.forge({id: id}).fetch(options).then(function then(obj) {
            return obj.destroy(options);
        });
    }

});
// Export mainBookshelf for use elsewhere
module.exports = mainBookshelf;