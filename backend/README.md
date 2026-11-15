# Forma backend

A small Express API using MongoDB Atlas through Mongoose. It starts only after
the database connection succeeds and exposes a health check and read-only,
paginated product catalog.

## Structure

```text
backend/
  src/
    config/          # Database connection
    controllers/     # HTTP request/response handlers
    middlewares/     # Validation, not-found, and error handling
    repositories/    # Mongoose queries
    routers/
      v1/            # Versioned product routes
    schema/          # Mongoose schemas
    services/        # Catalog business logic
    validators/      # Zod request validation
    app.js           # Express middleware and route setup
    index.js         # Database connection and HTTP lifecycle
  skills/
    express-mongodb-api/
      SKILL.md
  test/
```

## Requirements

- Node.js 22.18 or newer
- A MongoDB Atlas cluster and database user

## Local setup

1. In Atlas, create a database user and allow your development machine's IP in
   Network Access.
2. Copy `.env.example` to `.env` and replace the Atlas URI placeholders with the
   connection string from **Connect → Drivers**. URL-encode special characters
   in the database user's password.
3. From this directory, install and start the API:

   ```powershell
   npm install
   npm run dev
   ```

The API listens on port `4000` by default. Set `PORT` to change it.
`CLIENT_ORIGINS` accepts a comma-separated list of allowed browser origins; the
default is `http://localhost:3000`.

## Endpoints

- `GET /api/health` — returns `200` when MongoDB is connected, otherwise `503`.
- `GET /api/v1/products?limit=20&offset=0` — returns active products and total
  count.

Product documents use `name`, `description`, `price`, `category`, `imageUrl`,
`stock`, and `isActive` fields. The schema validates required fields, nonnegative
price/stock, and integer stock values. Insert catalog documents in Atlas or
MongoDB Compass to try the endpoint. There are deliberately no public write
routes in this starter.

## Checks

```powershell
npm test
```

The tests cover the database-aware health response, route and query validation,
and malformed or oversized JSON. They do not require an Atlas connection.
