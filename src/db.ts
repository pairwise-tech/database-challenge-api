import { Pool } from "pg";

const dropUserTable = `DROP TABLE users`;

const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  created_on DATE NOT NULL
)`;

export const initializeDatabasePool = () => {
  const pool = new Pool();

  pool.on("connect", () => {
    console.log("Connected to Postgres!");
  });

  const query = async (queryText: string, params?: any[]) => {
    try {
      const result = await pool.query(queryText, params);
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  return { pool, query };
};

export const setupTables = async (
  query: (queryText: string, params?: any[]) => Promise<any>
) => {
  // Create Users Table
  await query(dropUserTable);
  await query(createUserTable);
};
