import { Pool } from "pg";

const dropUserTable = `DROP TABLE IF EXISTS users`;

const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL
)`;

export const connectPoolAndQuery = async (userSQL: string, testSQL: string) => {
  const pool = new Pool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(userSQL);

    const result = await client.query(testSQL);

    // If you wanted to commit the query:
    // await client.query("COMMIT");
    await client.query("ROLLBACK");
    return result;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

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
