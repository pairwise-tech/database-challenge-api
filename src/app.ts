import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connectPoolAndQuery, setupTables, initializeDatabasePool } from "./db";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

const { query, pool } = initializeDatabasePool();

(async () => {
  await setupTables(query);
  console.log("Postgres Setup Complete.");
})();

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
 * POST query
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
 * POST
 */
app.post("/api", (req: Request, res: Response) => {
  const { body } = req;
  const response = {
    requestBody: body,
    message: "Got a POST request at /api 🎉",
  };
  res.json(response);
});

/**
 * PUT
 */
app.put("/api", (req: Request, res: Response) => {
  const { body } = req;
  const response = {
    requestBody: body,
    message: "Got a PUT request at /api 🎉",
  };
  res.json(response);
});

/**
 * DELETE a resource by id
 */
app.delete("/api/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const response = {
    requestId: id,
    message: "Got a DELETE request at /api 🎉",
  };
  res.json(response);
});

/** ===========================================================================
 * Run the Server
 * ============================================================================
 */

const PORT = process.env.SERVER_PORT || 5000;

app.listen(PORT, () => {
  console.log(`Pairwise HTTP API is running on http://localhost:${PORT}`);
});
