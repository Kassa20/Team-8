const { LRUCache } = require("lru-cache");
const countryRepo = require("../repositories/countryRepository");

const schemaCache = new LRUCache({ max: 200, ttl: 1000 * 60 * 10 });

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

const CA_PROVINCES = ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"];

// Simple service to ensure some default countries exist
async function ensureDefaultCountries() {
  const existing = await countryRepo.count();
  if (existing > 0) return;

  const defaults = [
    {
      code: "US",
      name: "United States",
      fields: [
        { name: "street", type: "text", required: true },
        { name: "apartment", type: "text", required: false },
        { name: "city", type: "text", required: true },
        { name: "state", type: "select", required: true, options: US_STATES },
        {
          name: "zip",
          type: "text",
          required: true,
          pattern: "^\\d{5}(-\\d{4})?$",
        },
      ],
    },
    {
      code: "CA",
      name: "Canada",
      fields: [
        { name: "street", type: "text", required: true },
        { name: "city", type: "text", required: true },
        { name: "province", type: "select", required: true, options: CA_PROVINCES },
        {
          name: "postalCode",
          type: "text",
          required: true,
          pattern: "^[A-Za-z]\\d[A-Za-z][ -]?\\d[A-Za-z]\\d$",
        },
      ],
    },
    {
      code: "IN",
      name: "India",
      fields: [
        { name: "house", type: "text", required: true },
        { name: "street", type: "text", required: true },
        { name: "area", type: "text", required: false },
        { name: "city", type: "text", required: true },
        { name: "state", type: "text", required: true },
        { name: "pin", type: "text", required: true, pattern: "^\\d{6}$" },
      ],
    },
    {
      code: "UK",
      name: "United Kingdom",
      fields: [
        { name: "addressLine1", type: "text", required: true },
        { name: "addressLine2", type: "text", required: false },
        { name: "townCity", type: "text", required: true },
        { name: "county", type: "text", required: false },
        {
          name: "postcode",
          type: "text",
          required: true,
          pattern:
            "^(GIR ?0AA|[A-Z]{1,2}\\d[A-Z\\d]? ?\\d[ABD-HJLNP-UW-Z]{2})$",
        },
      ],
    },
    {
      code: "DE",
      name: "Germany",
      fields: [
        { name: "street", type: "text", required: true },
        { name: "houseNumber", type: "text", required: true },
        { name: "city", type: "text", required: true },
        { name: "postalCode", type: "text", required: true, pattern: "^\\d{5}$" },
      ],
    },
    {
      code: "JP",
      name: "Japan",
      fields: [
        { name: "prefecture", type: "text", required: true },
        { name: "city", type: "text", required: true },
        { name: "ward", type: "text", required: false },
        { name: "street", type: "text", required: true },
        { name: "postalCode", type: "text", required: true, pattern: "^\\d{3}-?\\d{4}$" },
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

  await countryRepo.insertMany(defaults);
}

async function listCountries() {
  return countryRepo.list();
}

async function getCountrySchema(code) {
  const key = String(code || "").toUpperCase();
  const cached = schemaCache.get(key);
  if (cached) return cached;

  const country = await countryRepo.findByCode(key);
  if (!country) return null;

  const schema = { code: country.code, fields: country.fields };
  schemaCache.set(key, schema);
  return schema;
}

module.exports = {
  ensureDefaultCountries,
  listCountries,
  getCountrySchema,
  US_STATES,
  CA_PROVINCES,
};

