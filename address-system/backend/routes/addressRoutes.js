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
 *     summary: Search addresses by fields (name, country, q, and address.*)
 *     tags:
 *       - Addresses
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Partial match across normalized address text
 *     responses:
 *       200:
 *         description: List of matching addresses
 */
router.get("/search", addressController.searchAddresses);

/**
 * @swagger
 * /api/addresses/cross-search:
 *   get:
 *     summary: Cross-country search by partial text
 *     tags:
 *       - Addresses
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matching addresses across countries
 */
router.get("/cross-search", addressController.crossSearch);

/**
 * @swagger
 * /api/addresses/{id}:
 *   get:
 *     summary: Get address by id
 *     tags:
 *       - Addresses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address
 *       404:
 *         description: Not found
 */
router.get("/:id", addressController.getAddressById);

module.exports = router;


