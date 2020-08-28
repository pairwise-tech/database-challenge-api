import { Pool } from "pg";

/** ===========================================================================
 * Database Setup
 * ----------------------------------------------------------------------------
 * docs: https://node-postgres.com/
 * ============================================================================
 */

const dropUserTable = `DROP TABLE IF EXISTS users`;

const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL
)`;

export const setupPostgres = async () => {
  console.log("\n-> Starting Postgres setup...");
  const pool = new Pool();

  const query = async (queryText: string, params?: any[]) => {
    try {
      const result = await pool.query(queryText, params);
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  await query(dropUserTable);
  await query(createUserTable);

  console.log("-> Postgres Setup Complete!");
};

/** ===========================================================================
 * Transaction Handler
 * ----------------------------------------------------------------------------
 * reference: https://node-postgres.com/features/transactions
 * ============================================================================
 */

export const connectPoolAndQuery = async (
  userSQL: string,
  preSQL: string,
  postSQL: string
) => {
  const pool = new Pool();
  const client = await pool.connect();
  try {
    if (preSQL) {
      await client.query(preSQL);
    }

    await client.query("BEGIN");
    await client.query(userSQL);

    const result = await client.query(postSQL);

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
