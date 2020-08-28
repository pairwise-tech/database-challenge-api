import { MongoClient } from "mongodb";

const getMongoClient = async () => {
  console.log("\n-> Connecting to MongoDB Client");
  const client = await MongoClient.connect("mongodb://localhost:27017", {
    useUnifiedTopology: true,
    auth: {
      user: "mongodb",
      password: "mongodb",
    },
  });
  console.log("-> Connected to MongoDB Client");

  return client;
};

export const setupMongoDB = async () => {
  const mongoClient = await getMongoClient();
  const db = mongoClient.db("users");

  await db.collection("documents").insertOne({ name: "Joe", age: 25 });
  const result = await db.collection("documents").find({}).toArray();
  console.log(result);

  await db.dropDatabase();
};
