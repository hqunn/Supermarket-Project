import { Pool } from "pg";

// Kết nối PostgreSQL
const pool = new Pool({
  user: "postgres",         // Username (default is 'postgres')
  host: "localhost",        // Host (localhost if you're running PostgreSQL locally)
  database: "supermarket",  // The name of the database you created in pgAdmin
  password: "123Quan123",   // Your PostgreSQL password
  port: 5432,               // PostgreSQL default port
});

// Connect to the PostgreSQL database
pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL database"))
  .catch((err) => console.error("Connection error", err.stack));

export default pool;
