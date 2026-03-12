require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Address = require("../models/Address");

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  const { faker } = await import("@faker-js/faker");

  const usCities = [
    { city: "Boston", state: "MA", zip: "02118" },
    { city: "Chicago", state: "IL", zip: "60601" },
    { city: "Seattle", state: "WA", zip: "98101" },
    { city: "San Francisco", state: "CA", zip: "94105" },
  ];

  const canadaCities = [
    { city: "Toronto", province: "ON", postalCode: "M5H1J9" },
    { city: "Ottawa", province: "ON", postalCode: "K1P1N2" },
    { city: "Vancouver", province: "BC", postalCode: "V6C1S4" },
  ];

  const ukCities = [
    { city: "London", county: "Greater London", postcode: "SW1A2AA" },
    { city: "Manchester", county: "Greater Manchester", postcode: "M11AE" },
  ];

  const germanyCities = [
    { city: "Berlin", state: "Berlin", postalCode: "10178" },
    { city: "Munich", state: "Bavaria", postalCode: "80331" },
  ];

  const franceCities = [
    { city: "Paris", region: "Île-de-France", postalCode: "75001" },
    { city: "Lyon", region: "Auvergne-Rhône-Alpes", postalCode: "69002" },
  ];

  const japanCities = [
    { city: "Tokyo", prefecture: "Tokyo", postalCode: "1000001" },
    { city: "Osaka", prefecture: "Osaka", postalCode: "5300001" },
  ];

  const australiaCities = [
    { city: "Sydney", state: "NSW", postalCode: "2000" },
    { city: "Melbourne", state: "VIC", postalCode: "3000" },
  ];

  function generateUS() {
    const loc = random(usCities);

    return {
      name: faker.person.fullName(),
      country: "US",
      address: {
        street: faker.location.streetAddress(),
        city: loc.city,
        state: loc.state,
        zip: loc.zip,
      },
    };
  }

  function generateCanada() {
    const loc = random(canadaCities);

    return {
      name: faker.person.fullName(),
      country: "CA",
      address: {
        street: faker.location.streetAddress(),
        city: loc.city,
        province: loc.province,
        postalCode: loc.postalCode,
      },
    };
  }

  function generateUK() {
    const loc = random(ukCities);

    return {
      name: faker.person.fullName(),
      country: "UK",
      address: {
        street: faker.location.streetAddress(),
        city: loc.city,
        county: loc.county,
        postcode: loc.postcode,
      },
    };
  }

  function generateGermany() {
    const loc = random(germanyCities);

    return {
      name: faker.person.fullName(),
      country: "DE",
      address: {
        street: faker.location.streetAddress(),
        city: loc.city,
        state: loc.state,
        postalCode: loc.postalCode,
      },
    };
  }

  function generateFrance() {
    const loc = random(franceCities);

    return {
      name: faker.person.fullName(),
      country: "FR",
      address: {
        street: faker.location.streetAddress(),
        city: loc.city,
        region: loc.region,
        postalCode: loc.postalCode,
      },
    };
  }

  function generateJapan() {
    const loc = random(japanCities);

    return {
      name: faker.person.fullName(),
      country: "JP",
      address: {
        street: faker.location.streetAddress(),
        city: loc.city,
        prefecture: loc.prefecture,
        postalCode: loc.postalCode,
      },
    };
  }

  function generateAustralia() {
    const loc = random(australiaCities);

    return {
      name: faker.person.fullName(),
      country: "AU",
      address: {
        street: faker.location.streetAddress(),
        city: loc.city,
        state: loc.state,
        postalCode: loc.postalCode,
      },
    };
  }

  const generators = [
    generateUS,
    generateCanada,
    generateUK,
    generateGermany,
    generateFrance,
    generateJapan,
    generateAustralia,
  ];

  function generateAddress() {
    return random(generators)();
  }

  async function seedLargeAddresses(total = 10000, batchSize = 1000) {
    await connectDB();

    let inserted = 0;

    while (inserted < total) {
      const batch = [];
      const remaining = total - inserted;
      const currentBatch = Math.min(batchSize, remaining);

      for (let i = 0; i < currentBatch; i += 1) {
        batch.push(generateAddress());
      }

      await Address.insertMany(batch);
      inserted += currentBatch;

      console.log(`Inserted ${inserted}/${total}`);
    }

    console.log("Seeding complete");
    await mongoose.connection.close();
  }

  const total = Number(process.argv[2] || 10000);
  await seedLargeAddresses(total);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
