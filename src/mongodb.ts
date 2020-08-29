import { MongoClient } from "mongodb";
import { MONGO_DATABASE_URL } from "./env";

/** ===========================================================================
 * Database Setup
 * ----------------------------------------------------------------------------
 * docs: https://mongodb.github.io/node-mongodb-native/3.6/
 * ============================================================================
 */

export const setupMongoDB = async () => {
  console.log("\n-> Connecting to MongoDB Client...");

  const options = { useUnifiedTopology: true };
  const client = await MongoClient.connect(MONGO_DATABASE_URL, options);

  console.log("-> Connected to MongoDB Client!\n");
  return client;
};

/** ===========================================================================
 * Transaction Handler
 * ----------------------------------------------------------------------------
 * notes: I could get MongoDB transactions to work... alternatively we can
 * take an approach as follows below, e.g.
 *
 * 1. execute a query
 * 2. delete everything from the relevant collection
 * ============================================================================
 */

export const handleUsersQuery = async (client: MongoClient, args: any) => {
  // Get the users collection
  const users = client.db("test").collection("users");

  await users.insertOne(args);
  const result = users.findOne({ name: args.name });
  await users.deleteMany({});

  return result;
};
