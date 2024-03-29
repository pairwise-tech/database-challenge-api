# Pairwise Database Challenge API

An HTTP server equipped to run SQL and MongoDB queries for Pairwise database challenges.

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
```

This will run the databases locally for development using Docker Compose and run the server in watch mode. If you are working with Codepress, you will need to make sure the `DATABASE_CHALLENGE_API` in the `browser-test-lib.ts` file points to `localhost` address where this server is running.

To build the project, you can run:

```sh
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

## Deployment

This project is deployed using GCP Cloud Build triggers to Google App Engine: [check it out live](https://database-challenge-api.uc.r.appspot.com/). It connects to a Postgres database hosted on Cloud SQL and a MongoDB database hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
