const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const countryRoutes = require("./routes/countryRoutes");
const addressRoutes = require("./routes/addressRoutes");
const seedRoutes = require("./routes/seedRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const connectDB = require("./config/db");
const { ensureDefaultCountries } = require("./services/countryService");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Database
connectDB().then(() => {
  // Seed default countries if none exist
  ensureDefaultCountries().catch(() => {
    // eslint-disable-next-line no-console
    console.warn("Failed to ensure default countries");
  });
});

// Routes
app.use("/api/countries", countryRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/seed", seedRoutes);

// Compatibility aliases (spec without /api prefix)
app.use("/addresses", addressRoutes);
app.use("/seed", seedRoutes);

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// TODO: Add country-specific validation middleware

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});

