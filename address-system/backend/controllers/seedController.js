const { seed } = require("../services/seedService");

exports.seed = async (req, res) => {
  try {
    const { count } = req.body || {};
    const result = await seed({ count });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to seed database" });
  }
};

