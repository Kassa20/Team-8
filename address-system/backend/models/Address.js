const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    country: { type: String, required: true, index: true },
    address: {
      type: Object,
      required: true,
    },
    normalized: {
      type: String,
      required: true,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    minimize: false,
  }
);

// Index for nested city field inside address object
AddressSchema.index({ "address.city": 1 });
AddressSchema.index({ country: 1, name: 1, createdAt: -1 });
AddressSchema.index({ country: 1, normalized: 1 });
AddressSchema.index({ normalized: "text", name: "text" });

// TODO: Add advanced search optimization indexes

module.exports = mongoose.model("Address", AddressSchema);

