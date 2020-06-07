> Nodejs server with Typescript

# Server





### How to run

1) Install the dependencies and to start the application

```
yarn
yarn dev
```

2) Create a `.env` file and replace the `BASE_URL` with your machine's local IP. This is so we can serve files for the mobile project with React Native.

3) Running the migrations

```
yarn knex:migrate
```
which will run the following command: `yarn knex --knexfile knexfile.ts migrate:latest`



### App/Database entities

We currently have 3 tables: one for the places of collection, another for the items
themselves, and as these have a **N by N** relationship, we'll have a _pivot_ table _points\_items_.

- points (points/places of collection)
  - name
  - image
  - email
  - whatsapp
  - latitude
  - longitude
  - city
  - uf (state)

- items (collectable items)
  - title
  - image

- point_items (relationship about the items a place/point collects)
  - point_id
  - item_id

### Features implemented

- Registration of places/points of collection
- Listing the collectable items
- Listing of places/points (option to filter by state, city, items)
- Listing an specific point/place of collection

### Running with Insomnia (endpoints)

You can load the endpoints to test with the Insomnia REST client by clicking on the button below:

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=eColeta%20Backend&uri=https%3A%2F%2Fgithub.com%2Fpsatler%2FeColeta-Node-React-ReactNative%2Fblob%2Fmaster%2Fserver%2Finsomnia-export%2FInsomnia_2020-06-07.json)


Then, copy the URL and in the Insomnia app, look for the Import Data button, and choose From URL to load it to your app.

### Dependencies

- [Expressjs](https://github.com/expressjs/express): Fast, unopinionated, minimalist web framework for node.
- [Celebrate](https://github.com/arb/celebrate): A [joi](https://hapi.dev/module/joi/) validation middleware for Express. 
- [Dotenv](https://github.com/motdotla/dotenv): Loads environment variables from .env for nodejs projects. 
- [Knexjs](http://knexjs.org/): A query builder for PostgreSQL, MySQL and SQLite3, designed to be flexible, portable, and fun to use.
- [Sqlite3](https://www.npmjs.com/package/sqlite3) as the database. If you're using VSCode, download an extension called [SQLite](https://marketplace.visualstudio.com/items?itemName=alexcvzz.vscode-sqlite). Then, just `ctrl + shift + p` and type `>sqlite open database`. The _SQLite Explorer_ will be at the bottom left of VSCode.
- [Multer](https://github.com/expressjs/multer): Node.js middleware for handling `multipart/form-data`.
