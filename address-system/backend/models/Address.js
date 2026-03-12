const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    country: { type: String, required: true, index: true },
    address: {
      type: Object,
      required: true,
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

// Index for nested city field inside address object// might need change
AddressSchema.index({ country: 1, name: 1 });
AddressSchema.index({ country: 1, "address.street": 1 });
AddressSchema.index({ country: 1, "address.city": 1 });
AddressSchema.index({ country: 1, "address.state": 1 });


// TODO: Add advanced search optimization indexes

module.exports = mongoose.model("Address", AddressSchema);

