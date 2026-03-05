const express = require("express");
const router = express.Router();
const countryController = require("../controllers/countryController");

/**
 * @swagger
 * /api/countries:
 *   get:
 *     summary: Get supported countries
 *     tags:
 *       - Countries
 *     responses:
 *       200:
 *         description: List of countries
 */
router.get("/", countryController.getCountries);

/**
 * @swagger
 * /api/countries/{code}/schema:
 *   get:
 *     summary: Get address schema for a country
 *     tags:
 *       - Countries
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address schema for the country
 *       404:
 *         description: Country not found
 */
router.get("/:code/schema", countryController.getCountrySchema);

module.exports = router;


