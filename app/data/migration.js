var _           = require('lodash'),
    dbInstance  = require('../../config/db'),   // require knex instance
    schema      = require('./schema').tables,   // require schema file
    Promise         = require('bluebird'),

    schemaTables    = _.keys(schema),  // create array of tablename keys
    migrateUpFreshDb,
    init;

// to do: check database and if already exists, don't migrate data unless told explictly
init = function () {
    migrateUpFreshDb();
};


function addTableColumn(tablename, table, columnname) {
    var column,
        columnSpec = schema[tablename][columnname];

    // creation distinguishes between text with fieldtype, string with maxlength and all others
    if (columnSpec.type === 'text' && columnSpec.hasOwnProperty('fieldtype')) {
        column = table[columnSpec.type](columnname, columnSpec.fieldtype);
    } else if (columnSpec.type === 'string' && columnSpec.hasOwnProperty('maxlength')) {
        column = table[columnSpec.type](columnname, columnSpec.maxlength);
    } else {
        column = table[columnSpec.type](columnname);
    }

    if (columnSpec.hasOwnProperty('nullable') && columnSpec.nullable === true) {
        column.nullable();
    } else {
        column.notNullable();
    }
    if (columnSpec.hasOwnProperty('primary') && columnSpec.primary === true) {
        column.primary();
    }
    if (columnSpec.hasOwnProperty('unique') && columnSpec.unique) {
        column.unique();
    }
    if (columnSpec.hasOwnProperty('unsigned') && columnSpec.unsigned) {
        column.unsigned();
    }
    if (columnSpec.hasOwnProperty('references')) {
        // check if table exists?
        column.references(columnSpec.references);
    }
    if (columnSpec.hasOwnProperty('defaultTo')) {
        column.defaultTo(columnSpec.defaultTo);
    }
}

// table @param string is table name
function createTable(table) {
    var dbConfig = dbInstance.database;
    return dbConfig.schema.createTable(table, function (t) {
        // create an array of column keys from schema attributes and field options
        var columnKeys = _.keys(schema[table]);
        // iterate through each item in tablename array and return a function that adds a column to the table
        _.each(columnKeys, function (column) {
            return addTableColumn(table, t, column);
        });
    });
}

migrateUpFreshDb = function () {
    var tableSequence,
        // map created table functions and store in variable
        tables = _.map(schemaTables, function (table) {
            return function () {
                console.log('data.migration.index.creatingTable', {table: table});
                return createTable(table);
            };
        });
    console.log('data.migration.index.creatingTables');
    // where the magic happens -- MOVE THAT BUS, create all the tables
    tableSequence = sequence(tables);
};

// reduces tasks @param array and @return an array of results 
function sequence(tasks) {
    return Promise.reduce(tasks, function (results, task) {
        return task().then(function (result) {
            results.push(result);

            return results;
        });
    }, []);
}

// expose init function
module.exports = {
    init: init
};