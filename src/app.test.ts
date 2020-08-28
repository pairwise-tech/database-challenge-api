import axios from "axios";

/**
 * Add unit tests here.
 */
describe.skip("Placeholder test suite...", () => {
  test("Placeholder test...", () => {
    expect(true).toBe(true);
  });
});

/**
 * Example test for a database challenge.
 */
describe("Example Database Challenge Test", () => {
  const runQuery = async (userSQL: string, testSQL: string) => {
    const url = "http://localhost:5000/query";
    const body = { userSQL, testSQL };

    try {
      const result = await axios.post(url, body);
      return result;
    } catch (err) {
      // Fail by default if error
      console.log(err);
      expect(true).toBe(false);
    }
  };

  test("A user named Ryan with email ryan@mail.com should be created.", async () => {
    // Written in the code editor for the challenge:
    const SQL =
      "INSERT INTO users (name, email) VALUES ('Ryan', 'ryan@mail.com');";

    // Our SQL for the test assertion:
    const TEST_SQL = "SELECT * FROM users";

    // Send the queries to the Database Query API:
    const result = await runQuery(SQL, TEST_SQL);

    // Perform test assertions:
    const first = result?.data.rows[0];
    expect(first.name).toBe("Ryan");
    expect(first.email).toBe("ryan@mail.com");
  });
});
