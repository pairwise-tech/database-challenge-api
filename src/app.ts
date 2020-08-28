import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connectPoolAndQuery, initializeDatabasePool } from "./postgres";
import { getMongoClient } from "./mongodb";

/** ===========================================================================
 * Setup Server
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
 * /query POST route.
 *
 * Generic query route which accepts and runs arbitrary SQL code, rolling
 * back transactions to leave the database unchanged.
 */
app.post("/query", async (req: Request, res: Response) => {
  const { userSQL, testSQL } = req.body;
  if (!userSQL || !testSQL) {
    res.status(400);
    res.send("Invalid body provided.");
  }

  try {
    console.log("-> Executing queries for challenges.");
    const result = await connectPoolAndQuery(userSQL, testSQL);
    res.json(result);
  } catch (err) {
    res.status(400);
    res.send(`Error executing query: ${err}`);
  }
});

/**
 * /query POST route.
 *
 * Generic query route which accepts and runs arbitrary SQL code, rolling
 * back transactions to leave the database unchanged.
 */
app.post("/mongodb/query", async (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query) {
    res.status(400);
    res.send("Invalid body provided.");
  }

  try {
    // TODO:
    res.json({});
  } catch (err) {
    res.status(400);
    res.send(`Error executing query: ${err}`);
  }
});

/** ===========================================================================
 * Run the Server
 * ============================================================================
 */

const PORT = process.env.SERVER_PORT || 5000;

(async () => {
  await initializeDatabasePool();

  const mongoClient = getMongoClient();

  app.listen(PORT, () => {
    console.log(`\nPairwise HTTP API is running on http://localhost:${PORT}\n`);
  });
})();
