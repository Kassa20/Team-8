const Address = require("../models/Address");

// provider function to get unique options for a specific address field based on country and optional dependencies
async function getFieldOptions(country, field, dependencies = {}) {
  const filter = { country: String(country).toUpperCase() };
  for (const [key, value] of Object.entries(dependencies)) {
    if (value) filter[`address.${key}`] = value;
  }
  const results = await Address.distinct(`address.${field}`, filter);
  return { ok: true, data: results.filter(Boolean).sort() };
}

// 
async function search({ name, country, address, q, limit = 100 }) {
  const filter = {};

  // 1. mulitple country support: allow comma-separated list of countries
  if (country) {
    const countryArray = String(country).split(',').map(c => c.trim().toUpperCase()).filter(c => c.length > 0);
    if (countryArray.length > 1) filter.country = { $in: countryArray };
    else if (countryArray.length === 1) filter.country = countryArray[0];
  }

  // 2. name search: allow partial match on name field
  if (name) filter.name = { $regex: String(name), $options: "i" };

  // 3. allow searching across multiple address fields with a single "address" parameter
  const searchQuery = q || address;
  if (searchQuery) {
    filter["$or"] = [
      { "address.street": { $regex: String(searchQuery), $options: "i" } },
      { "address.city": { $regex: String(searchQuery), $options: "i" } },
      { "address.state": { $regex: String(searchQuery), $options: "i" } },
      { "address.province": { $regex: String(searchQuery), $options: "i" } },
      { "address.zip": { $regex: String(searchQuery), $options: "i" } },
      { "address.postalCode": { $regex: String(searchQuery), $options: "i" } }
    ];
  }

  const results = await Address.find(filter).limit(Math.min(Number(limit) || 100, 500));
  return { ok: true, data: results };
}

module.exports = {
  search,
  getFieldOptions,
  ensureDefaultAddresses: async () => { }
};