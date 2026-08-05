const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");

const UserController = require("../controllers/UserController");
/**
 * @swagger
 * /user/vendors:
 *   get:
 *     summary: Get all vendors
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vendor list fetched successfully
 *       401:
 *         description: Unauthorized
 */

router.get("/vendors", verifyToken, UserController.getAllVendors);

/**
 * @swagger
 * /user/pervendors:
 *   get:
 *     summary: Get all vendors using permission
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vendor list fetched successfully
 *       403:
 *         description: Permission denied
 */

router.get("/pervendors",verifyToken,
  checkPermission("VIEW_VENDOR"),
  UserController.getAllVendors
);

module.exports = router;
