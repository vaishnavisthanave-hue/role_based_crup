const { User, Role } = require("../models");

const checkAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: [
                {
                    model: Role,
                    attributes: ["id", "name"]
                }
            ]
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!user.Role || user.Role.name.toLowerCase() !== "admin") {
            return res.status(403).json({
                message: "Admin access required"
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            message: "Authorization failed",
            error: error.message
        });
    }
};

module.exports = 
    checkAdmin;