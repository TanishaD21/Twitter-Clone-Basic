require("dotenv").config();

const { drizzle } = require("drizzle-orm/postgres-js");
const postgres = require("postgres");

// Initialize the PostgreSQL client using the connection string from the environment variable
const client  = postgres(process.env.DATABASE_URL);


// Create a Drizzle ORM instance using the PostgreSQL client
const db = drizzle(client);

module.exports = db;