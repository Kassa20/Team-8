const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

/**
 * @swagger
 * /api/addresses/search:
 *   get:
 *     summary: Search addresses by name, city, or country
 *     tags:
 *       - Addresses
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of matching addresses
 */
router.get("/search", addressController.searchAddresses);
router.get("/options", addressController.getAddressOptions);
router.get("/resolve", addressController.resolveAddress);

module.exports = router;


