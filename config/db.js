// Instantiate knex instance and connect to postgres
var database;
// To Do: change connection string to environment variable
// change debug option to true only on development mode
database = require('knex')({
		client: 'pg',
		connection: {
			host:	'pgtestdb.cnwpn1vj6dzu.us-east-1.rds.amazonaws.com',
			user:	'austin',
			password:	'password',
			database:	'postgres',
			debug: true
		}
	});
console.log('knex-instantiated and pg-connection successful!');

module.exports.database = database;