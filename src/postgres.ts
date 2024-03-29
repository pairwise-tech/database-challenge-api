import { Pool } from "pg";
import getMoviesSql from "./tools/getMoviesSql";

/** ===========================================================================
 * Database Setup
 * ----------------------------------------------------------------------------
 * docs: https://node-postgres.com/
 * ============================================================================
 */

// User Table Setup
const dropUserTable = `DROP TABLE IF EXISTS users`;

const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100),
  username VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

const dropMovieTable = `DROP TABLE IF EXISTS movie`;

const createMovieTable = `
CREATE TABLE IF NOT EXISTS movie (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  writer VARCHAR NOT NULL,
  director VARCHAR NOT NULL,
  year VARCHAR(4),
  genre VARCHAR(100),
  rated VARCHAR(10) NOT NULL,
  rotten_tomatoes_rating DECIMAL(3),
  runtime_min INT
)`;

const populateMovieTable = getMoviesSql();

export const setupPostgres = async () => {
  console.log("\n-> Starting Postgres setup...");
  const pool = new Pool();

  const query = async (queryText: string, params?: any[]) => {
    try {
      const result = await pool.query(queryText, params);
      return result;
    } catch (err) {
      console.log("Failed to run setupPostgres Query, error: ", err);
      throw err;
    }
  };

  await query(dropUserTable);
  await query(createUserTable);

  await query(dropMovieTable);
  await query(createMovieTable);
  await query(populateMovieTable);

  console.log("-> Postgres Setup Complete!");
};

/** ===========================================================================
 * Transaction Handler
 * ----------------------------------------------------------------------------
 * reference: https://node-postgres.com/features/transactions
 * ============================================================================
 */

/**
 *
 * SQL will be executed as follows:
 *
 * 1. preSQL is run (if provided).
 * 2. userSQL is run.
 * 3. postSQL is run and the result is saved.
 * 4. The transaction is rolled back to avoid any state changes.
 * 5. Saved result from Step 3 is returned.
 *
 * The result from Step 3 above is basically taking a snapshot of the
 * database state after the user's SQL code runs which allows us to
 * determine if the user's code was effective or not. This result is
 * sent back to the Workspace where the test assertions are performed.
 */
export const connectPoolAndQuery = async (
  preQuery: string,
  userQuery: string,
  postQuery: string
) => {
  const pool = new Pool();
  const client = await pool.connect();
  try {
    if (preQuery) {
      await client.query(preQuery);
    }

    await client.query("BEGIN");
    await client.query(userQuery);

    const result = await client.query(postQuery);

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
