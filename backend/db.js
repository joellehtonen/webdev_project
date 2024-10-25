const { Pool } = require("pg");

const pool = new Pool({
  user: "youruser",
  host:
    typeof process.env.database_URL !== undefined
      ? process.env.DATABASE_URL
      : "localhost",
  database: "pokemon-db",
  password: "yourpassword",
  port: 5432,
});

exports.pool = pool;
