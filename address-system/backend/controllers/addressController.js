const Address = require("../models/Address");

// Create a new address entry
exports.createAddress = async (req, res) => {
  try {
    const { name, country, address } = req.body;

    if (!name || !country || !address) {
      return res.status(400).json({ message: "name, country and address are required" });
    }

    // TODO: Add country-specific validation for address fields

    const newAddress = await Address.create({
      name,
      country,
      address,
    });

    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ message: "Failed to create address" });
  }
};

// Search addresses by name, city, or country
exports.searchAddresses = async (req, res) => {
  try {
    const { name, city, country } = req.query;
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }
    if (city) {
      filter["address.city"] = { $regex: city, $options: "i" };
    }
    if (country) {
      filter.country = country.toUpperCase();
    }

    const results = await Address.find(filter).sort({ createdAt: -1 }).limit(100);

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Failed to search addresses" });
  }
};
exports.getAddressOptions = async (req, res) => {
  try {
    const { country, field, q = "", name, street, city, state } = req.query;

    if (!country || !field) {
      return res
        .status(400)
        .json({ message: "country and field are required" });
    }

    const normalizedCountry = country.toUpperCase();
    const filter = { country: normalizedCountry };


    if (field !== "name" && name) {
      filter.name = name;
    }

    if ((field === "city" || field === "state" || field === "zip") && street) {
      filter["address.street"] = street;
    }

    if ((field === "state" || field === "zip") && city) {
      filter["address.city"] = city;
    }

    if (field === "zip" && state) {
      filter["address.state"] = state;
    }

    const results = await Address.find(filter).lean();

    let rawOptions = [];

    if (field === "name") {
      rawOptions = results.map((item) => item.name);
    } else if (field === "street") {
      rawOptions = results.map((item) => item.address?.street);
    } else if (field === "city") {
      rawOptions = results.map((item) => item.address?.city);
    } else if (field === "state") {
      rawOptions = results.map((item) => item.address?.state);
    } else if (field === "zip") {
      rawOptions = results.map((item) => item.address?.zip);
    } else {
      return res.status(400).json({ message: "Unsupported field" });
    }

    const searchText = String(q).trim().toLowerCase();

    const filteredOptions = rawOptions
      .filter(Boolean)
      .filter((value) =>
        searchText ? value.toLowerCase().includes(searchText) : true
      );

    const uniqueOptions = [...new Set(filteredOptions)];

    res.json({ options: uniqueOptions });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch address options" });
  }
};

exports.resolveAddress = async (req, res) => {
  try {
    const { country, name, street, city, state } = req.query;

    if (!country || !name || !street || !city || !state) {
      return res.status(400).json({
        message: "country, name, street, city and state are required",
      });
    }

    const match = await Address.findOne({
      country: country.toUpperCase(),
      name,
      "address.street": street,
      "address.city": city,
      "address.state": state,
    }).lean();

    if (!match) {
      return res.json({ zip: "" });
    }

    res.json({
      zip: match.address?.zip || "",
      address: match,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to resolve address" });
  }
};

