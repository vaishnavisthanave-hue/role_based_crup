const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const checkPermission = require("../middleware/checkPermission");

const AuthController = require("../controllers/AuthController");
const UserController = require("../controllers/UserController");
const validateCreateUser =  require("../validator/userValidator");
const asyncHandler = require("../middleware/asyncHandler");

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Authentication APIs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad Request
 */
router.post("/register", AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", AuthController.login);

/**
 * @swagger
 * /auth/create-user:
 *   post:
 *     summary: Create a new user (Protected)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               roleId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/create-user", verifyToken, isAdmin,validateCreateUser,  asyncHandler(AuthController.createUser));

router.get("/", verifyToken, isAdmin,AuthController.getuser);

/**
 /**
 * @swagger
 * /auth/assign-permission:
 *   post:
 *     summary: Assign permission to a user
 *     description: Only Admin users can assign permissions.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - permissionId
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 2
 *               permissionId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Permission assigned successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Only Admin users can assign permissions
 *       404:
 *         description: User or Permission not found
 */
router.post( "/:id",asyncHandler(AuthController.requestDelete));
router.post( "/assign-permission",verifyToken, isAdmin, AuthController.assignPermission);
router.get( "/fetchdeletependinguser",verifyToken, isAdmin, AuthController.fatchpendingdelete);

module.exports = router;