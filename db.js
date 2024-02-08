import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  password: process.env.DB_PASS,
  host: "localhost",
  port: 5432,
  database: "control_history_db"
});

pool.on('connect', (client) => {
  client.setTypeParser(1114, (stringValue) => {
    const date = new Date(stringValue);
    return date.toISOString().slice(0, 10);
  });
});

export default pool;
