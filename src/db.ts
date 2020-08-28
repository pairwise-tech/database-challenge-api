import { Pool } from "pg";

export const connectPool = () => {
  console.log("Connecting to Postgres");

  const databaseConfig = { connectionString: process.env.DATABASE_URL };
  const pool = new Pool(databaseConfig);

  pool.on("connect", () => {
    console.log("connected to the db");
  });

  const query = (quertText: any, params: any) => {
    return new Promise((resolve, reject) => {
      pool
        .query(quertText, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  return { pool, query };
};
