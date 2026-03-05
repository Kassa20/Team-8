// Placeholder seed script for addresses
// Run with: node seed.js (after setting MONGO_URI)

// TODO: Implement large dataset seeding for addresses

const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Address = require("./models/Address");

dotenv.config();

async function run() {
  await connectDB();

  // TODO: Add logic to generate and insert many address records for performance testing

  // eslint-disable-next-line no-console
  console.log("Seed script placeholder - implement data generation here.");
  await Address.deleteMany({ placeholder: true }); // no-op example to keep linter happy
  process.exit(0);
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

