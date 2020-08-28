# Pairwise Database Challenge API

An HTTP server equipped to run SQL queries for Pairwise database challenges.

## Getting Started

Install [NodeJS](https://nodejs.org/en/), [yarn](https://yarnpkg.com/lang/en/docs/), and [Docker](https://www.docker.com/) and run the following:

```sh
# Install dependencies
$ yarn install

# Setup
$ yarn setup

# Run postgres and mongodb using docker
$ yarn up

# Run the server for development
$ yarn watch

# Run the build
$ yarn build
```

The project also has some linting rules and tests:

```sh
# Apply formatting rules
$ yarn format

# Run project unit tests
$ yarn test:unit

# Run project linting and tests
$ yarn test
```

## Challenges

An example challenge test might look like this:

```js
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
```

## Deployment

**TODO!**
