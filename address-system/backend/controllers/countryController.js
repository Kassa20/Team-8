const { listCountries, getCountrySchema } = require("../services/countryService");

// Get list of all countries
exports.getCountries = async (req, res) => {
  try {
    const countries = await listCountries();
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch countries" });
  }
};

// Get schema/fields for a specific country code
exports.getCountrySchema = async (req, res) => {
  try {
    const { code } = req.params;
    const country = await getCountrySchema(code);

    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    res.json(country);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch country schema" });
  }
};

