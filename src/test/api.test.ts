import axios from "axios";

/**
 * Test the Database Challenge API.
 *
 * This requires the server and databases to be running
 */
describe.skip("Database Challenge API Test", () => {
  test("A user named Ryan with email ryan@mail.com should be created using a SQL INSERT INTO statement.", async () => {
    const executePostgresQuery = async (
      userSQL: string,
      preSQL: string,
      postSQL: string
    ) => {
      const url = "http://localhost:5000/postgres/query";
      const body = { userSQL, preSQL, postSQL };

      try {
        return axios.post(url, body);
      } catch (err) {
        // Fail by default if error
        console.log(err);
        expect(true).toBe(false);
      }
    };

    // Written in the code editor for the challenge:
    const SQL =
      "INSERT INTO users (name, email) VALUES ('Ryan', 'ryan@mail.com');";

    // Our SQL for the test assertion:
    const TEST_SQL = "SELECT * FROM users";

    // Send the queries to the Database Query API:
    const result = await executePostgresQuery(SQL, "", TEST_SQL);

    // Perform test assertions:
    const first = result?.data.rows[0];
    expect(first.name).toBe("Ryan");
    expect(first.email).toBe("ryan@mail.com");
  });

  /**
   * Question: How to arbitrarily execute MongoDB queries?
   *
   * Ideally we want to be able to give the user flexibility for writing
   * different types of queries and not constrain them...
   *
   * On the other hand this might be too complex and it could be easier to
   * just provide constraint to get them through some of the basics quickly
   * and easily, that is to say simple CRUD goes a long way.
   */
  test("A user named Joe with email joe@mail.com should be created using MongoDB insertOne query.", async () => {
    const executeMongoQuery = async (args: any) => {
      const url = "http://localhost:5000/mongodb/query";
      const body = { args };

      try {
        return axios.post(url, body);
      } catch (err) {
        // Fail by default if error
        console.log(err);
        expect(true).toBe(false);
      }
    };

    // Written in the code editor for the challenge:
    const args = { name: "Joe", email: "joe@mail.com", age: 27 };

    // Send the queries to the Database Query API:
    const result = await executeMongoQuery(args);

    // Perform test assertions:
    const first = result?.data;
    expect(first.name).toBe("Joe");
    expect(first.email).toBe("joe@mail.com");
  });
});
