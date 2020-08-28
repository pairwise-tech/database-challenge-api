import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connectPoolAndQuery, setupPostgres } from "./postgres";
import { setupMongoDB, handleUsersQuery } from "./mongodb";
import { POSTGRES_LOCK, wait, MONGO_LOCK } from "./utils";

/** ===========================================================================
 * Setup Server & API Endpoints
 * ============================================================================
 */

const app = express();

// Enable cors
app.use(cors());

// Enable parsing body
app.use(bodyParser.json());

/**
 * Index route.
 */
app.get("/", (req: Request, res: Response) => {
  res.send("Pairwise Database Test API is online 🎉");
});

/**
 * /postgres/query POST route.
 *
 * Generic query route which accepts and runs arbitrary SQL code, rolling
 * back transactions to leave the database unchanged.
 */
app.post("/postgres/query", async (req: Request, res: Response) => {
  const { userSQL, preSQL, postSQL } = req.body;
  if (!userSQL) {
    return res.status(400).send("Invalid body provided.");
  }

  /**
   * Execute the query, waiting if the database is locked.
   */
  const execute = async (): Promise<any> => {
    try {
      if (POSTGRES_LOCK.isLocked()) {
        // Wait 1 second and retry
        await wait();
        return execute();
      }

      POSTGRES_LOCK.lock();
      const result = await connectPoolAndQuery(userSQL, preSQL, postSQL);
      POSTGRES_LOCK.unlock();
      return res.json(result);
    } catch (err) {
      POSTGRES_LOCK.unlock();
      return res.status(400).send(`Error executing query: ${err}`);
    }
  };

  return execute();
});

/**
 * /mongodb/query POST route.
 *
 * Query route to handle MongoDB database queries.
 */
app.post("/mongodb/query", async (req: Request, res: Response) => {
  const { args } = req.body;
  if (!args) {
    return res.status(400).send("Invalid body provided.");
  }

  /**
   * Execute the query, waiting if the database is locked.
   */
  const execute = async (): Promise<any> => {
    try {
      if (MONGO_LOCK.isLocked()) {
        // Wait 1 second and retry
        await wait();
        return execute();
      }

      MONGO_LOCK.lock();

      const client = app.get("mongo");
      const result = await handleUsersQuery(client, args);
      MONGO_LOCK.unlock();
      return res.json(result);
    } catch (err) {
      MONGO_LOCK.unlock();
      return res.status(400).send(`Error executing query: ${err}`);
    }
  };

  return execute();
});

/** ===========================================================================
 * Run the Server
 * ============================================================================
 */

const PORT = process.env.SERVER_PORT || 5000;

(async () => {
  // Setup Postgres Connection
  await setupPostgres();

  // Test MongoDB Connection
  const client = await setupMongoDB();

  // Provide mongo connection to app
  app.set("mongo", client);

  // Start the server
  app.listen(PORT, () => {
    console.log(`Pairwise HTTP API is running on http://localhost:${PORT}\n`);
  });
})();
