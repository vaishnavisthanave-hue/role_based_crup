const { Role } = require("../models");

const isAdmin = async (error,req, res, next) => {
    try {
        const role = await Role.findOne({
            where: {
                id: req.user.roleid,
                name: "admin"
            }
        });

        if (!role) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only."
            });
        }

        next();
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = isAdmin;