
require('dotenv').config()

const pgPromise         = require('pg-promise');
const QueryResultError  = pgPromise.errors.QueryResultError;
const qrec              = pgPromise.errors.queryResultErrorCode;

var host                = process.env.POSTGRES_DB_ADDRESS || '';
var port                = process.env.POSTGRES_DB_PORT || 0;
var database            = process.env.POSTGRES_DB_NAME || '';
var user                = process.env.POSTGRES_DB_USER || '';
var password            = process.env.POSTGRES_DB_PASSWORD || '';

const pgp = pgPromise({
});

const config = {
    host: host,
    port: port,
    database: database,
    user: user,
    password: password
}

const db = pgp(config);

exports.db = db;
