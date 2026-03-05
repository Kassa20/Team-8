const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Create a new address entry
 *     tags:
 *       - Addresses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               country:
 *                 type: string
 *               address:
 *                 type: object
 *             required:
 *               - name
 *               - country
 *               - address
 *     responses:
 *       201:
 *         description: Address created
 *       400:
 *         description: Validation error
 */
router.post("/", addressController.createAddress);

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

module.exports = router;


