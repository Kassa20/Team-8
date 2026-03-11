const Country = require("../models/Country");

// Simple service to ensure some default countries exist
async function ensureDefaultCountries() {
  const existing = await Country.estimatedDocumentCount();
  if (existing > 0) return;

  const defaults = [
    {
      code: "US",
      name: "United States",
      fields: [
        { name: "street", type: "text", required: true },
        { name: "city", type: "text", required: true },
        { name: "state", type: "text", required: true },
        { name: "zip", type: "text", required: true },
      ],
    },
    {
      code: "CA",
      name: "Canada",
      fields: [
        { name: "street", type: "text", required: true },
        { name: "city", type: "text", required: true },
        { name: "province", type: "text", required: true },
        { name: "postalCode", type: "text", required: true },
      ],
    },
    {
  code: "CN",
  name: "China",
  fields: [
    { name: "province", type: "text", required: true },
    { name: "city", type: "text", required: true },
    { name: "district", type: "text", required: true },
    { name: "street", type: "text", required: true },
    { 
      name: "postalCode", 
      type: "text", 
      required: true,
      // China postal codes are 6 digits, for Validation purposes
      pattern: "^[0-9]{6}$" 
    },
  ],
},
  ];

  await Country.insertMany(defaults);
}

module.exports = {
  ensureDefaultCountries,
};

