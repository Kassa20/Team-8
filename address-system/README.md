## Global Address Management System

Starter production-oriented full-stack app for capturing and searching country-specific postal addresses.

### Stack
- **Frontend**: React (CRA) + Axios (Tailwind ready)
- **Backend**: Node.js + Express + Swagger
- **DB**: MongoDB (Mongoose)

---

## Run locally (dev)

### Backend
From `address-system/backend`:

```bash
npm install
# Optional (recommended): use your own MongoDB / Atlas
# Create .env with:
# MONGO_URI=mongodb://localhost:27017/address_system
npm start
```

- Backend: `http://localhost:5000`
- Swagger UI: `http://localhost:5000/api-docs`

If `MONGO_URI` is not set, backend will use an **in-memory MongoDB** for easy startup.

### Frontend
From `address-system/frontend`:

```bash
npm install
npm start
```

- Frontend: `http://localhost:3000`

---

## Run with Docker
From `address-system/`:

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

---

## API (high level)

### Countries
- `GET /api/countries`
- `GET /api/countries/:code/schema`

### Addresses
- `POST /api/addresses`
- `GET /api/addresses/:id`
- `GET /api/addresses/search` (supports `name`, `country`, `q`, and any `address.<field>` as query params)
- `GET /api/addresses/cross-search?q=...`

### Seed
- `POST /api/seed` body: `{ "count": 5000 }`

Compatibility aliases exist (without `/api`): `/addresses/*`, `/seed`.

---

## Notes / TODOs
- TODO: Stronger country-specific validation and richer dropdown datasets (UK counties, JP prefectures, IN states)
- TODO: Replace cross-search with MongoDB Atlas Search for better relevance + speed at scale
- TODO: Seed performance: switch to `bulkWrite` for very large datasets

