import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  password: process.env.DB_PASS,
  host: "localhost",
  port: 5432,
  database: "control_history_db"
});

export default pool;
