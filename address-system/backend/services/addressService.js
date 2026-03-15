const Address = require("../models/Address");

async function ensureDefaultAddresses() {

  const defaultAddresses = [
    {
      name: "John Doe",
      country: "US",
      address: {
        street: "123 Main St",
        city: "Boston",
        state: "MA",
        zip: "02118"
      }
    },
    {
      name: "John Doe",
      country: "US",
      address: {
        street: "456 Oak Ave",
        city: "Chicago",
        state: "IL",
        zip: "60601"
      }
    },
    {
      name: "Jane Smith",
      country: "US",
      address: {
        street: "789 Pine Rd",
        city: "Seattle",
        state: "WA",
        zip: "98101"
      }
    },


    {
      name: "Alice Brown",
      country: "CA",
      address: {
        street: "100 King St",
        city: "Toronto",
        province: "ON",
        postalCode: "M5H1J9"
      }
    },
    {
      name: "Alice Brown",
      country: "CA",
      address: {
        street: "250 Queen St",
        city: "Ottawa",
        province: "ON",
        postalCode: "K1P1N2"
      }
    },
    {
      name: "Bob Martin",
      country: "CA",
      address: {
        street: "300 Granville St",
        city: "Vancouver",
        province: "BC",
        postalCode: "V6C1S4"
      }
    },


    {
      name: "Oliver Jones",
      country: "UK",
      address: {
        street: "10 Downing St",
        city: "London",
        county: "Greater London",
        postcode: "SW1A2AA"
      }
    },
    {
      name: "Emily Taylor",
      country: "UK",
      address: {
        street: "25 Market St",
        city: "Manchester",
        county: "Greater Manchester",
        postcode: "M11AE"
      }
    },


    {
      name: "Hans Müller",
      country: "DE",
      address: {
        street: "Alexanderplatz 1",
        city: "Berlin",
        state: "Berlin",
        postalCode: "10178"
      }
    },
    {
      name: "Anna Schmidt",
      country: "DE",
      address: {
        street: "Marienplatz 8",
        city: "Munich",
        state: "Bavaria",
        postalCode: "80331"
      }
    },

    {
      name: "Jean Dupont",
      country: "FR",
      address: {
        street: "12 Rue de Rivoli",
        city: "Paris",
        region: "Île-de-France",
        postalCode: "75001"
      }
    },
    {
      name: "Marie Laurent",
      country: "FR",
      address: {
        street: "5 Place Bellecour",
        city: "Lyon",
        region: "Auvergne-Rhône-Alpes",
        postalCode: "69002"
      }
    },

    {
      name: "Yuki Tanaka",
      country: "JP",
      address: {
        street: "1-1 Chiyoda",
        city: "Tokyo",
        prefecture: "Tokyo",
        postalCode: "1000001"
      }
    },
    {
      name: "Haruto Suzuki",
      country: "JP",
      address: {
        street: "2-3 Umeda",
        city: "Osaka",
        prefecture: "Osaka",
        postalCode: "5300001"
      }
    },

    {
      name: "Liam Wilson",
      country: "AU",
      address: {
        street: "50 George St",
        city: "Sydney",
        state: "NSW",
        postalCode: "2000"
      }
    },
    {
      name: "Olivia Martin",
      country: "AU",
      address: {
        street: "80 Collins St",
        city: "Melbourne",
        state: "VIC",
        postalCode: "3000"
      }
    }

  ];

  await Address.insertMany(defaultAddresses);
  console.log("default addresses seeded");
}

module.exports = { ensureDefaultAddresses };
