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

