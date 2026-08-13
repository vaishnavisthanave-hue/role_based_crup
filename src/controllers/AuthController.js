const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Role, Permission, UserPermission } = require("../models");
const crypto = require("crypto");
const AppError = require("../utils/AppError");
const { Op } = require("sequelize");

class AuthController {

    // Register User
    static async register(req, res) {
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
    }

    // Login
    static async login(req, res) {

        try {

            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and Password are required"
                });
            }

            const user = await User.findOne({
                where: { email }
            });


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

            const sessionToken = crypto.randomBytes(32).toString("hex");

            await user.update({
                sessionToken
            });
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    roleid: user.roleid,
                    sessionToken: user.sessionToken,
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
                    roleid: user.roleid,
                    sessionToken: user.sessionToken,

                }
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });

        }

    }

    static async createUser(req, res) {

        try {

            const { name, email, password, roleid } = req.body;
            // if (!name || !email || !password || !roleid) {
            //     return res.status(400).json({
            //         success: false,
            //         message: "Name, email, password and roleid are required."
            //     });
            // }

            // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // if (!emailRegex.test(email)) {
            //     return res.status(400).json({
            //         success: false,
            //         message: "Invalid email format."
            //     });
            // }

            // // Password strength
            // const passwordRegex =
            //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

            // if (!passwordRegex.test(password)) {
            //     return res.status(400).json({
            //         success: false,
            //         message:
            //             "Password must be at least 8 characters and include uppercase, lowercase, number and special character."
            //     });
            // }

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
            const userData = user.toJSON();
            delete userData.password;

            return res.status(201).json({
                success: true,
                message: "User created successfully.",
                data: userData
            });

        } catch (err) {

            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });

        }
    }

    static async assignPermission(req, res) {
        try {

            const { userid, permissionId } = req.body;

            // Check User
            const user = await User.findByPk(userid);

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
                    userId: userid,
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
                userId: userid,
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
                message: "Internal server error."
            });
        }
    }

    //     static async requestDelete(req, res) {
    //   try {
    //     const user = await User.findByPk(req.params.id);

    //     if (!user) {
    //       return res.status(404).json({
    //         success: false,
    //         message: "User not found",
    //       });
    //     }

    //     await user.update({
    //       is_request: 1,
    //     });

    //     return res.status(200).json({
    //       success: true,
    //       message: "User deletion request submitted",
    //     });
    //   } catch (error) {
    //     return res.status(500).json({
    //       success: false,
    //       message: error.message,
    //     });
    //   }
    // }

    static async requestDelete(req, res) {
        console.log("requestDelete CONTROLLER CALLED");

        const user = await User.findByPk(req.params.id);


        if (!user) {

            throw AppError(
                "User not found",
                404,
                "USER_NOT_FOUND"
            );
        }

        await user.update({
            is_request: 1
        });

        return res.status(200).json({
            success: true,
            message: "User deletion request submitted"
        });
    }



    static async fatchpendingdelete(req, res) {
        try {
            const user = await User.findAll({
                where: {
                    is_request: 1,
                    active: 1,
                }
            })
            if (user.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: "No pending user found.",
                    data: [],
                });
            }
            return res.status(200).json({
                success: true,
                message: "Pending users found.",
                data: user,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
                data: [],
            });
        }
    }

  static async getuser(req, res, next) {
        try {

            // Pagination
            const page = Math.max(
                parseInt(req.query.page) || 1,
                1
            );

            const limit = Math.min(
                Math.max(parseInt(req.query.limit) || 5, 1),
                100
            );

            const offset = (page - 1) * limit;

            // Filters
            const { name, email, active, roleid } = req.query;

            const where = {};

            // Name filter
            if (name) {
                where.name = {
                    [Op.like]: `%${name}%`
                };
            }

            // Email filter
            if (email) {
                where.email = {
                    [Op.like]: `%${email}%`
                };
            }

            // Active filter
            if (active !== undefined) {
                where.active = Number(active);
            }

            // Role filter
            if (roleid !== undefined) {
                where.roleid = Number(roleid);
            }

            // Query
            const result = await User.findAndCountAll({
                where,
                limit,
                offset,
                order: [
                    ["id", "DESC"]
                ]
            });

            // Total pages
            const totalPages = Math.ceil(
                result.count / limit
            );

            return res.status(200).json({
                success: true,
                message: "Records found",

                data: result.rows,

                pagination: {
                    currentPage: page,
                    limit: limit,
                    totalRecords: result.count,
                    totalPages: totalPages,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1
                }
            });

        } catch (error) {

            next(error);

        }
    }

}



module.exports = AuthController;