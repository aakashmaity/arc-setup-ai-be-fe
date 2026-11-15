---
name: express-mongodb-api
description: Maintain the Forma Node.js backend using its Express, Mongoose, layered API structure and validation conventions.
---

# Express and MongoDB API

Use this skill when adding or changing backend API behavior in `backend/`.

## Structure

- `src/config`: database and environment configuration.
- `src/controllers`: HTTP request/response handling only.
- `src/middlewares`: request validation, 404 handling, and error responses.
- `src/repositories`: Mongoose queries and persistence.
- `src/routers`: API mount points; versioned endpoints live in `src/routers/v1`.
- `src/schema`: Mongoose schemas and models.
- `src/services`: application behavior between controllers and repositories.
- `src/validators`: Zod request schemas.
- `src/app.js`: Express middleware and route composition.
- `src/index.js`: connect to MongoDB before listening; own graceful shutdown.

## Rules

- Keep request/response concerns in controllers and database calls in repositories.
- Validate external input with Zod middleware before controllers use it.
- Keep Atlas credentials in `.env`; do not commit credentials or add them to logs.
- Do not add unauthenticated write endpoints. Add authentication and authorization
  before introducing create, update, or delete routes.
- Keep error responses JSON and avoid returning database error details to clients.
- Add focused tests for observable endpoint behavior. Tests should not require a live
  Atlas cluster unless they are explicitly integration tests.

## Validation

Run `npm test` from `backend/`. API startup requires a valid `MONGODB_URI`.
