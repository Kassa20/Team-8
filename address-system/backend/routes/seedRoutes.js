const express = require("express");
const router = express.Router();
const seedController = require("../controllers/seedController");

/**
 * @swagger
 * /api/seed:
 *   post:
 *     summary: Seed database with generated addresses
 *     tags:
 *       - Seed
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               count:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Seed result
 */
router.post("/", seedController.seed);

module.exports = router;

