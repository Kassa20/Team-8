const mongoose = require("mongoose");

const CountryFieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    required: { type: Boolean, default: false },
    options: { type: [String], default: undefined },
    defaultValue: { type: String, default: undefined },
    pattern: { type: String, default: undefined },
  },
  { _id: false }
);

const CountrySchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  fields: { type: [CountryFieldSchema], default: [] },
});

// TODO: Add country-specific validation rules based on fields

module.exports = mongoose.model("Country", CountrySchema);

