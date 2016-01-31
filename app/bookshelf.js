
// remember to set a base Bookshelf instance to pass around and require


// 2ND CALL, and starts to create tables based on the table names passed
// dbConfig || config.database is a knex instance or Bookshelf instanec
// @params is the table name
// .keys is mapping keys from schema['posts'] for example, and turning them into an array
// .each then iterates through the array of column keys and adds to table column with addTableColumn
// each .each iteration returns a created column, so table is created when .each is done
function createTable(table) {
    dbConfig = dbConfig || config.database;
    return dbConfig.knex.schema.createTable(table, function (t) {
        var columnKeys = _.keys(schema[table]);
        _.each(columnKeys, function (column) {
            return addTableColumn(table, t, column);
        });
    });
}

// 3RD CALL
// addTableColumn takes the tablename value, empty(?) table value, and columnname (iterate thru columnKeys)
// columnSpec is an object from schema field that specifies type, defaults, etc
// @table param is knex instance or bookshelf instance
// so for each column key, addTableColumn checks the type and other options, then returns the column variable
// var column is the created column
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


///////////////


// 

var Promise = require('bluebird');
// reduces @task array 
function sequence(tasks) {
    return Promise.reduce(tasks, function (results, task) {
        return task().then(function (result) {
            results.push(result);

            return results;
        });
    }, []);
}


  var schemaTables    = _.keys(schema), // take all the keys and force object into ARRAY format

// THIS IS FIRST IN CHAIN
// @params {boolean}

// tableSequence is completed sequence function Promise with all results (???)
migrateUpFreshDb = function (tablesOnly) {
    var tableSequence,

    // tables are the mapped array of an array of schema objects [post, user, admin],
    // which are then passed to createTable function, which returns a createTable knex function,
    // which returns a bunch of columns from createtablecolumn();
        tables = _.map(schemaTables, function (table) {
            return function () {
                logInfo(i18n.t('notices.data.migration.index.creatingTable', {table: table}));
                return utils.createTable(table);
            };
        });
    logInfo(i18n.t('notices.data.migration.index.creatingTables'));

    // 5th CALL WHEN tables .map is complete
    tableSequence = sequence(tables);


    // (ASSUME ALWAYS TRUE)  RETURN RESULTS ARRAY FROM SEQUENCE FUNCTION WHEN COMPLETE
    if (tablesOnly) {
        return tableSequence;
    }
    return tableSequence.then(function () {
        // Load the fixtures
        return fixtures.populate();
    }).then(function () {
        return populateDefaultSettings();
    });
};


// configure PG client driver
function configureDriver(client) {
    var pg;

    if (client === 'pg' || client === 'postgres' || client === 'postgresql') {
        try {
            pg = require('pg');
        } catch (e) {
            pg = require('pg.js');
        }

        // By default PostgreSQL returns data as strings along with an OID that identifies
        // its type.  We're setting the parser to convert OID 20 (int8) into a javascript
        // integer.
        pg.types.setTypeParser(20, function (val) {
            return val === null ? null : parseInt(val, 10);
        });
    }
}


// remember to create model relations, and import them all into one index file
// then require the one model index for any type of data manipulation 
// return a models.init() that goes through all model files and extends them, then loads them 
// onto the app