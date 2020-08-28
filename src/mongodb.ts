import { MongoClient } from "mongodb";

/** ===========================================================================
 * Database Setup
 * ----------------------------------------------------------------------------
 * docs: https://mongodb.github.io/node-mongodb-native/3.6/
 * ============================================================================
 */

export const setupMongoDB = async () => {
  console.log("\n-> Connecting to MongoDB Client...");

  const user = process.env.MONGO_USER;
  const password = process.env.MONGO_PASSWORD;
  const url = `mongodb://${user}:${password}@localhost:27017/test?authSource=admin`;
  const options = { useUnifiedTopology: true };
  const client = await MongoClient.connect(url, options);

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
  const users = client.db("test").collection("user");

  await users.insertOne(args);
  const result = users.findOne({ name: args.name });
  await users.deleteMany({});

  return result;
};
