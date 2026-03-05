const Country = require("../models/Country");

// Get list of all countries
exports.getCountries = async (req, res) => {
  try {
    const countries = await Country.find({}, { _id: 0, __v: 0 }).sort({ name: 1 });
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch countries" });
  }
};

// Get schema/fields for a specific country code
exports.getCountrySchema = async (req, res) => {
  try {
    const { code } = req.params;
    const country = await Country.findOne(
      { code: code.toUpperCase() },
      { _id: 0, __v: 0 }
    );

    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    res.json({
      code: country.code,
      fields: country.fields,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch country schema" });
  }
};

