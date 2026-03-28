# Content Sharing API

REST API for a content-sharing application: user accounts, JWT authentication, posts, threaded comments, likes, follows, and optional image uploads via Cloudinary.

## Tech stack

| Area | Technology |
|------|------------|
| Runtime | Node.js (ES modules) |
| Framework | Express |
| Database | MongoDB with Mongoose |
| Auth | JWT (`jsonwebtoken`), password hashing (`bcryptjs`) |
| File uploads | `multer` + Cloudinary |
| API docs | OpenAPI 3 + Swagger UI (`swagger-ui-express`) |
| Logging | `pino`, `pino-http` (pretty output in development) |
| Migrations | `migrate-mongo` |
| Config | `dotenv` (`.env` then `.env.dev`) |

## Requirements

- **Node.js** — current LTS (e.g. 20.x) recommended  
- **MongoDB** — local instance or a connection string to MongoDB Atlas (or compatible host)  
- **npm** — comes with Node  

Optional:

- **Cloudinary** — set `CLOUDINARY_URL` if you use image upload endpoints  

## Configuration

1. Copy the example environment file and adjust values:

   ```bash
   copy .env.example .env
   ```

   On Unix-like shells: `cp .env.example .env`

2. Optionally create **`.env.dev`** (gitignored) for machine-specific overrides. Loading order from the project root:

   - `.env` is loaded first  
   - `.env.dev` is merged next and overrides keys that were not already set in the shell  

3. Set at least:

   | Variable | Purpose |
   |----------|---------|
   | `MONGODB_URI` | MongoDB connection string |
   | `JWT_SECRET` | Secret for signing JWTs (use a long random value in production) |
   | `PORT` | HTTP port (default `3001` if omitted) |
   | `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
   | `CLOUDINARY_URL` | Only if you need uploads |

## Run the app

Install dependencies (including dev dependencies for readable logs in development):

```bash
npm install
```

**Development** (auto-restart on file changes):

```bash
npm run dev
```

**Production-style** (no watch):

```bash
npm start
```

When the server is up, logs include the base URL plus:

- **Health:** `GET /health`  
- **Swagger UI:** `/api-docs`  
- **OpenAPI JSON:** `/openapi.json`  

API routes are mounted under `/api` (see Swagger for paths and schemas).

## Other scripts

| Script | Description |
|--------|-------------|
| `npm run seed` | Run the seed script (`src/scripts/seed.js`) |
| `npm run migrate` | Apply MongoDB migrations (`migrate-mongo`) |
| `npm run migrate:down` | Roll back last migration |
| `npm run migrate:status` | Show migration status |
| `npm run migrate:create` | Create a new migration file |

Migrations use `MONGODB_URI` from your env files (see `migrate-mongo-config.cjs`).
