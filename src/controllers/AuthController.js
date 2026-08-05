const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Role, Permission, UserPermission } = require("../models");


console.log("   User Attributes:", User);

const AuthController = {

    // Register User
    async register(req, res) {
        try {

            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required"
                });
            }

            const userExists = await User.findOne({
                where: { email }
            });

            if (userExists) {
                return res.status(409).json({
                    success: false,
                    message: "Email already exists"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                name,
                email,
                password: hashedPassword
            });

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }
    },

    // Login
    async login(req, res) {

        try {

            const { email, password } = req.body;
            console.log("console.log(req.body);", req.body);
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and Password are required"
                });
            }

            const user = await User.findOne({
                where: { email }
            });

            console.log("user11", user);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid Email or Password"
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid Email or Password"
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    roleid: user.roleid
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );

            return res.status(200).json({
                success: true,
                message: "Login Successful",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    roleid: user.roleid
                }
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    },

    createUser: async (req, res) => {


        try {

            console.log("req.user", req.user);
            const role = await Role.findOne({
                where: {
                    id: req.user.roleid,
                    name: "admin"
                }
            });

            if (!role) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to create users."
                });
            }

            const { name, email, password, roleid } = req.body;

            const exists = await User.findOne({
                where: { email }
            });

            if (exists) {
                return res.status(400).json({
                    success: false,
                    message: "Email already exists."
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                roleid
            });

            return res.status(201).json({
                success: true,
                message: "User created successfully.",
                data: user
            });

        } catch (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

    },
    async assignPermission(req, res) {
        try {

            const { userId, permissionId } = req.body;

            // Check User
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Check Permission
            const permission = await Permission.findByPk(permissionId);

            if (!permission) {
                return res.status(404).json({
                    success: false,
                    message: "Permission not found"
                });
            }

            // Check if permission is already assigned
            const alreadyAssigned = await UserPermission.findOne({
                where: {
                    userId,
                    permissionId
                }
            });

            if (alreadyAssigned) {
                return res.status(400).json({
                    success: false,
                    message: "Permission already assigned to this user"
                });
            }

            // Assign Permission
            const assignPermission = await UserPermission.create({
                userId,
                permissionId
            });

            return res.status(201).json({
                success: true,
                message: "Permission assigned successfully",
                data: assignPermission
            });

        } catch (error) {
            console.error("Assign Permission Error:", error);

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}



module.exports = AuthController;