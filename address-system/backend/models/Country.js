const mongoose = require("mongoose");

const CountryFieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    label: { type: String, trim: true },
    type: { type: String, enum: ["text", "select"], required: true, default: "text", },
    required: { type: Boolean, default: false },
    defaultValue: { type: String, default: "" },
    options: { type: [{ type: String, trim: true }], default: [] },
    source: { type: String, enum: ["static", "lookup"], default: "static", },
    dependsOn: { type: [{ type: String, trim: true }], default: [] },
    autoFill: { type: Boolean, default: false },
    readOnly: { type: Boolean, default: false },
    placeholder: { type: String, trim: true, default: "" },
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

