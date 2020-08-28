import { MongoClient } from "mongodb";

export const getMongoClient = async () => {
  console.log("-> Connecting to MongoDB Client");
  const client = await MongoClient.connect("mongodb://localhost:27017");
  console.log("-> Connected to MongoDB Client");
  return client;
};
