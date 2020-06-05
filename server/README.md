> Nodejs server with Typescript

# Server





### How to run

1) Install the dependencies and to start the application

```
yarn
yarn dev
```

2) Running the migrations

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

### Dependencies

- [Expressjs]()
- [Dotenv]()
- [Knexjs](http://knexjs.org/) query builder
- [Sqlite3](https://www.npmjs.com/package/sqlite3) as the database. If you're using VSCode, download an extension called [SQLite](https://marketplace.visualstudio.com/items?itemName=alexcvzz.vscode-sqlite). Then, just `ctrl + shift + p` and type `>sqlite open database`. The _SQLite Explorer_ will be at the bottom left of VSCode.
- [Multer](https://github.com/expressjs/multer): Node.js middleware for handling `multipart/form-data`. 