const mongoose = require("mongoose");

let memoryServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    // Dev-friendly fallback so the starter runs without a local Mongo install.
    // If you set MONGO_URI (local MongoDB or Atlas), that will be used instead.
    if (!uri) {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      memoryServer = await MongoMemoryServer.create();
      uri = memoryServer.getUri("address_system");
      // eslint-disable-next-line no-console
      console.log("Using in-memory MongoDB (mongodb-memory-server)");
      // TODO: Expand seed script to support large dataset seeding
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    // eslint-disable-next-line no-console
    console.log("MongoDB connected");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

