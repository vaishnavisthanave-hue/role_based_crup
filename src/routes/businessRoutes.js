const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth");
const upload = require("../middleware/upload");
const BusinessController = require("../controllers/BusinessController");
const validateCreateBusiness = require("../validator/businessValidator");
const canAccessBusiness = require("../middleware/canAccessBusiness");

/**
 * @swagger
 * tags:
 *   name: Business
 *   description: Business Management APIs
 */

/**
 * @swagger
 * /business:
 *   post:
 *     summary: Create a new business
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               discription:
 *                 type: string
 *              
 *     responses:
 *       201:
 *         description: Business created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  validateCreateBusiness,
  BusinessController.createBusiness
);

/**
 * @swagger
 * /business:
 *   get:
 *     summary: Get all businesses
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of businesses
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, BusinessController.getAllBusinesses);

/**
 * @swagger
 * /business/mybusiness:
 *   get:
 *     summary: Get logged-in user's businesses
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User businesses fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/mybusiness", verifyToken, BusinessController.getMyBusinesses);

/**
 * @swagger
 * /business/{id}:
 *   get:
 *     summary: Get business by ID
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Business found
 *       404:
 *         description: Business not found
 */
router.get("/:id", verifyToken, BusinessController.getBusinessById);

/**
 * @swagger
 * /business/{id}:
 *   put:
 *     summary: Update business
 *     tags: [Business]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               discription:
 *                 type: string
 *             
 *     responses:
 *       200:
 *         description: Business updated successfully
 *       404:
 *         description: Business not found
 */
router.put("/:id", verifyToken, upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  BusinessController.updateBusiness
);

router.delete( "/:id",verifyToken,canAccessBusiness, BusinessController.deleteBusiness);
module.exports = router;