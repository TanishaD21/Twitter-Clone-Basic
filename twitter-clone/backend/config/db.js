const postgres = require("postgres");
const { drizzle } = require("drizzle-orm/postgres-js");
require("dotenv").config();

const client = postgres(process.env.DATABASE_URL, {
    max: 10,
});

const db = drizzle(client);

module.exports = db;