# Address Management System

A full-stack web application for managing and searching country-specific addresses with dynamic form generation. The system supports 7 countries (US, Canada, UK, Germany, France, Japan, Australia), each with its own address schema — fields, validation rules, and dependencies adapt automatically based on the selected country.

## Features

- **Dynamic Address Forms** — Form fields are generated from country-specific schemas with dependent field lookups, auto-fill (e.g., postal code resolution), and creatable dropdowns
- **Global & Local Search** — Search addresses across all countries or filter within a specific one, with regex-based partial matching and pagination
- **Country-Specific Schemas** — Each country defines its own fields, labels, types (text/select), dependencies, and data sources (static options or database lookups)
- **Auto-Seeding** — Ships with default country configurations and sample addresses; includes a bulk seeding script using Faker for generating large datasets
- **Interactive API Docs** — Swagger UI available at `/api-docs`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Axios, React Select |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB (Atlas) / MongoDB Memory Server (dev fallback) |
| **ORM** | Mongoose |
| **API Docs** | Swagger (swagger-jsdoc + swagger-ui-express) |
| **Data Generation** | Faker.js |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/countries` | List all supported countries |
| `GET` | `/api/countries/:code/schema` | Get address field schema for a country |
| `GET` | `/api/addresses/search` | Search addresses (supports `name`, `address`, `country`, `page`, `limit`) |
| `GET` | `/api/addresses/options` | Fetch dropdown options for dependent fields |
| `GET` | `/api/addresses/resolve` | Auto-resolve postal/ZIP code from other fields |

## Getting Started

1. Clone the repo
2. Install dependencies:
   ```bash
   cd address-system/backend && npm install
   cd ../frontend && npm install
   ```
3. Configure `.env` in `backend/` with your `MONGO_URI` (or omit to use in-memory MongoDB)
4. Start the servers:
   ```bash
   # Backend (port 5000)
   cd backend && npm start

   # Frontend (port 3000)
   cd frontend && npm start
   ```
5. Visit `http://localhost:3000` for the app or `http://localhost:5000/api-docs` for API documentation
