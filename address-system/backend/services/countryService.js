const Country = require("../models/Country");

// Simple service to ensure some default countries exist
async function ensureDefaultCountries() {
  //const existing = await Country.estimatedDocumentCount();
  //if (existing > 0) return;
  const defaultCountries = [
    {
      code: "US",
      name: "United States",
      fields: [
        {
          name: "name",
          label: "Full Name",
          type: "select",
          required: true,
          source: "lookup",
          placeholder: "Start typing a name"
        },
        {
          name: "street",
          label: "Street Address",
          type: "select",
          required: true,
          source: "lookup",
          dependsOn: ["name"],
          placeholder: "Start typing street address"
        },
        {
          name: "city",
          label: "City",
          type: "select",
          required: true,
          source: "lookup",
          dependsOn: ["name", "street"],
          placeholder: "Select city"
        },
        {
          name: "state",
          label: "State",
          type: "select",
          required: true,
          source: "lookup",
          dependsOn: ["name", "street", "city"],
          placeholder: "Select state"
        },
        {
          name: "zip",
          label: "ZIP Code",
          type: "text",
          required: true,
          source: "lookup",
          dependsOn: ["name", "street", "city", "state"],
          autoFill: true,
          readOnly: true,
          placeholder: "Auto-filled ZIP code"
        }
      ]
    },
    {
      code: "CA",
      name: "Canada",
      fields: [
        { name: "name", label: "Full Name", type: "select", source: "lookup" },
        { name: "street", label: "Street Address", type: "select", source: "lookup", dependsOn: ["name"] },
        { name: "city", label: "City", type: "select", source: "lookup", dependsOn: ["name", "street"] },
        { name: "province", label: "Province", type: "select", source: "lookup", dependsOn: ["name", "street", "city"] },
        { name: "postalCode", label: "Postal Code", type: "text", autoFill: true, readOnly: true }
      ]
    },
    {
      code: "UK",
      name: "United Kingdom",
      fields: [
        { name: "name", label: "Full Name", type: "select", source: "lookup" },

        { name: "street", label: "Street Address", type: "select", source: "lookup", dependsOn: ["name"] },

        { name: "city", label: "City", type: "select", source: "lookup", dependsOn: ["name", "street"] },

        { name: "county", label: "County", type: "select", source: "lookup", dependsOn: ["name", "street", "city"] },

        { name: "postcode", label: "Postcode", type: "text", autoFill: true, readOnly: true }
      ]
    },
    {
      code: "DE",
      name: "Germany",
      fields: [
        { name: "name", label: "Full Name", type: "select", source: "lookup" },

        { name: "street", label: "Street Address", type: "select", source: "lookup", dependsOn: ["name"] },

        { name: "city", label: "City", type: "select", source: "lookup", dependsOn: ["name", "street"] },

        { name: "state", label: "State (Bundesland)", type: "select", source: "lookup", dependsOn: ["name", "street", "city"] },

        { name: "postalCode", label: "Postal Code", type: "text", autoFill: true, readOnly: true }
      ]
    },
    {
      code: "FR",
      name: "France",
      fields: [
        { name: "name", label: "Full Name", type: "select", source: "lookup" },

        { name: "street", label: "Street Address", type: "select", source: "lookup", dependsOn: ["name"] },

        { name: "city", label: "City", type: "select", source: "lookup", dependsOn: ["name", "street"] },

        { name: "region", label: "Region", type: "select", source: "lookup", dependsOn: ["name", "street", "city"] },

        { name: "postalCode", label: "Postal Code", type: "text", autoFill: true, readOnly: true }
      ]
    },
    {
      code: "JP",
      name: "Japan",
      fields: [
        { name: "name", label: "Full Name", type: "select", source: "lookup" },

        { name: "street", label: "Street Address", type: "select", source: "lookup", dependsOn: ["name"] },

        { name: "city", label: "City", type: "select", source: "lookup", dependsOn: ["name", "street"] },

        { name: "prefecture", label: "Prefecture", type: "select", source: "lookup", dependsOn: ["name", "street", "city"] },

        { name: "postalCode", label: "Postal Code", type: "text", autoFill: true, readOnly: true }
      ]
    },
    {
      code: "AU",
      name: "Australia",
      fields: [
        { name: "name", label: "Full Name", type: "select", source: "lookup" },

        { name: "street", label: "Street Address", type: "select", source: "lookup", dependsOn: ["name"] },

        { name: "city", label: "City / Suburb", type: "select", source: "lookup", dependsOn: ["name", "street"] },

        { name: "state", label: "State / Territory", type: "select", source: "lookup", dependsOn: ["name", "street", "city"] },

        { name: "postalCode", label: "Postal Code", type: "text", autoFill: true, readOnly: true }
      ]
    }

  ];
  await Country.deleteMany({});
  await Country.insertMany(defaultCountries);
  console.log("default countries seeded");
}

module.exports = {
  ensureDefaultCountries,
};

