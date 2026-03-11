const { faker } = require("@faker-js/faker");
const addressRepo = require("../repositories/addressRepository");
const { buildNormalizedAddressString } = require("./normalizeService");

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function genUS() {
  return {
    country: "US",
    address: {
      street: faker.location.streetAddress(),
      apartment: faker.helpers.maybe(() => faker.location.secondaryAddress(), { probability: 0.35 }) || "",
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zip: faker.location.zipCode("#####"),
    },
  };
}

function genCA() {
  return {
    country: "CA",
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      province: faker.location.state({ abbreviated: true }),
      postalCode: faker.location.zipCode("?#?#?#").toUpperCase(),
    },
  };
}

function genUK() {
  return {
    country: "UK",
    address: {
      addressLine1: faker.location.streetAddress(),
      addressLine2: faker.helpers.maybe(() => faker.location.secondaryAddress(), { probability: 0.3 }) || "",
      townCity: faker.location.city(),
      county: faker.helpers.maybe(() => faker.location.county(), { probability: 0.4 }) || "",
      postcode: faker.location.zipCode("??# #??").toUpperCase(),
    },
  };
}

function genIN() {
  return {
    country: "IN",
    address: {
      house: faker.location.buildingNumber(),
      street: faker.location.street(),
      area: faker.helpers.maybe(() => faker.location.secondaryAddress(), { probability: 0.35 }) || "",
      city: faker.location.city(),
      state: faker.location.state(),
      pin: faker.string.numeric(6),
    },
  };
}

function genDE() {
  return {
    country: "DE",
    address: {
      street: faker.location.street(),
      houseNumber: faker.location.buildingNumber(),
      city: faker.location.city(),
      postalCode: faker.string.numeric(5),
    },
  };
}

function genJP() {
  return {
    country: "JP",
    address: {
      prefecture: faker.location.state(),
      city: faker.location.city(),
      ward: faker.helpers.maybe(() => faker.location.county(), { probability: 0.3 }) || "",
      street: faker.location.streetAddress(),
      postalCode: `${faker.string.numeric(3)}-${faker.string.numeric(4)}`,
    },
  };
}

const generators = {
  US: genUS,
  CA: genCA,
  UK: genUK,
  IN: genIN,
  DE: genDE,
  JP: genJP,
};

async function seed({ count = 5000 } = {}) {
  const target = Math.min(Number(count) || 5000, 50000);

  // Approximate population-weighted distribution (adjustable)
  const distribution = [
    { code: "US", weight: 40 },
    { code: "IN", weight: 25 },
    { code: "DE", weight: 10 },
    { code: "JP", weight: 10 },
    { code: "UK", weight: 8 },
    { code: "CA", weight: 7 },
  ];

  const weighted = [];
  distribution.forEach((d) => {
    for (let i = 0; i < d.weight; i++) weighted.push(d.code);
  });

  const docs = [];
  for (let i = 0; i < target; i++) {
    const code = randomPick(weighted);
    const gen = generators[code] || genUS;
    const { country, address } = gen();
    const name = faker.person.fullName();
    const normalized = buildNormalizedAddressString({ name, country, address });
    docs.push({ name, country, address, normalized });
  }

  // Insert in chunks for memory safety
  const chunkSize = 1000;
  let inserted = 0;
  for (let i = 0; i < docs.length; i += chunkSize) {
    const chunk = docs.slice(i, i + chunkSize);
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(chunk.map((d) => addressRepo.create(d)));
    inserted += chunk.length;
  }

  return { inserted };
}

// TODO: Replace naive insert with bulkWrite for very large datasets

module.exports = { seed };

