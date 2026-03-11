const addressService = require("../services/addressService");

// Create a new address entry
exports.createAddress = async (req, res) => {
  try {
    const result = await addressService.createAddress(req.body);
    if (!result.ok) return res.status(result.status || 400).json(result.error);
    res.status(201).json(result.data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("createAddress error", error);
    res.status(500).json({ message: "Failed to create address" });
  }
};

// Get address by id
exports.getAddressById = async (req, res) => {
  try {
    const result = await addressService.getById(req.params.id);
    if (!result.ok) return res.status(result.status || 404).json(result.error);
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch address" });
  }
};

// Search addresses by name, city, or country
exports.searchAddresses = async (req, res) => {
  try {
    const result = await addressService.search(req.query);
    if (!result.ok) return res.status(result.status || 400).json(result.error);
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to search addresses" });
  }
};

// Cross-country search
exports.crossSearch = async (req, res) => {
  try {
    const result = await addressService.crossSearch(req.query);
    if (!result.ok) return res.status(result.status || 400).json(result.error);
    res.json(result.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to cross-search addresses" });
  }
};

