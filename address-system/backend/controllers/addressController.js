const Address = require("../models/Address");
const Country = require("../models/Country");

// Create a new address entry
exports.createAddress = async (req, res) => {
  try {
    const { name, country, address } = req.body;

    if (!name || !country || !address) {
      return res
        .status(400)
        .json({ message: "name, country and address are required" });
    }

    const newAddress = await Address.create({
      name,
      country: country.toUpperCase(),
      address,
    });

    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ message: "Failed to create address" });
  }
};

// Search addresses by name, address (street), or country
exports.searchAddresses = async (req, res) => {
  try {
    const { name, address, country } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 20)
    );
    const skip = (page - 1) * limit;

    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    if (address) {
      const regex = { $regex: address, $options: "i" };
      filter.$or = [
        { "address.street": regex },
        { "address.city": regex },
        { "address.state": regex },
        { "address.zip": regex },
        { "address.province": regex },
        { "address.postalCode": regex },
        { "address.postcode": regex },
        { "address.county": regex },
        { "address.region": regex },
        { "address.prefecture": regex },
      ];
    }

    if (country) {
      const codes = country.split(",").map((c) => c.trim().toUpperCase());
      filter.country = { $in: codes };
    }

    const [result] = await Address.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            name: "$name",
            country: "$country",
            street: "$address.street",
          },
          doc: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$doc" } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const data = result?.data || [];
    const totalCount = result?.totalCount?.[0]?.count || 0;

    res.json({
      data,
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to search addresses" });
  }
};

async function getCountrySchemaMap(countryCode) {
  const country = await Country.findOne(
    { code: countryCode.toUpperCase() },
    { _id: 0, fields: 1 }
  ).lean();

  if (!country) return null;

  const fields = country.fields || [];
  const byName = Object.fromEntries(fields.map((f) => [f.name, f]));

  return {
    fields,
    byName,
    postalField:
      fields.find((f) => f.autoFill)?.name ||
      ["zip", "postalCode", "postcode"].find((name) => byName[name]) ||
      null,
  };
}

exports.getAddressOptions = async (req, res) => {
  try {
    const { country, field, q = "" } = req.query;

    if (!country || !field) {
      return res
        .status(400)
        .json({ message: "country and field are required" });
    }

    const normalizedCountry = country.toUpperCase();
    const schemaMap = await getCountrySchemaMap(normalizedCountry);

    if (!schemaMap) {
      return res.status(404).json({ message: "Country not found" });
    }

    const requestedField = schemaMap.byName[field];
    if (!requestedField && field !== "name") {
      return res.status(400).json({ message: "Unsupported field" });
    }

    const filter = { country: normalizedCountry };

    if (field !== "name" && req.query.name) {
      filter.name = req.query.name;
    }

    const dependsOn = requestedField?.dependsOn || [];

    for (const dep of dependsOn) {
      if (dep === "name") continue;

      const depValue = req.query[dep];
      if (depValue) {
        filter[`address.${dep}`] = depValue;
      }
    }

    const results = await Address.find(filter).lean();

    let rawOptions = [];

    if (field === "name") {
      rawOptions = results.map((item) => item.name);
    } else {
      rawOptions = results.map((item) => item.address?.[field]);
    }

    const searchText = String(q).trim().toLowerCase();

    const filteredOptions = rawOptions
      .filter(Boolean)
      .filter((value) =>
        searchText ? String(value).toLowerCase().includes(searchText) : true
      );

    const uniqueOptions = [...new Set(filteredOptions)];

    res.json({ options: uniqueOptions });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch address options" });
  }
};

exports.resolveAddress = async (req, res) => {
  try {
    const { country, name } = req.query;

    if (!country || !name) {
      return res
        .status(400)
        .json({ message: "country and name are required" });
    }

    const normalizedCountry = country.toUpperCase();
    const schemaMap = await getCountrySchemaMap(normalizedCountry);

    if (!schemaMap) {
      return res.status(404).json({ message: "Country not found" });
    }

    const postalField = schemaMap.postalField;

    if (!postalField) {
      return res
        .status(400)
        .json({ message: "No postal field configured for this country" });
    }

    const filter = {
      country: normalizedCountry,
      name,
    };

    const postalSchemaField = schemaMap.byName[postalField];
    const dependsOn = postalSchemaField?.dependsOn || [];

    for (const dep of dependsOn) {
      if (dep === "name") continue;

      const depValue = req.query[dep];
      if (!depValue) {
        return res.status(400).json({
          message: `Missing required field: ${dep}`,
        });
      }

      filter[`address.${dep}`] = depValue;
    }

    const match = await Address.findOne(filter).lean();

    if (!match) {
      return res.json({ postalCode: "", field: postalField });
    }

    res.json({
      postalCode: match.address?.[postalField] || "",
      field: postalField,
      address: match,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to resolve address" });
  }
};
