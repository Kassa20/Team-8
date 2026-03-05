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
  ];

  await Country.insertMany(defaults);
}

module.exports = {
  ensureDefaultCountries,
};

