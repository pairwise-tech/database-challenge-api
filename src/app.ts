import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { setupTables, initializeDatabasePool } from "./db";

/** ===========================================================================
 * Types & Config
 * ============================================================================
 */

const { query, pool } = initializeDatabasePool();

setupTables(query);

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
  res.send("Pairwise Example HTTP API is online 🎉");
});

/**
 * POST query
 */
app.post("/query", async (req: Request, res: Response) => {
  const { sql } = req.body;
  if (!sql) {
    res.status(400);
    res.send("Must provide a sql query field in the JSON POST body.");
  }

  try {
    const result = await query(sql);
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
