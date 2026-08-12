const { User,Role } = require("../models");

const isUserActive = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.user.id,
                active :1,             
            }
        });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Access denied. User is not Active"
            });
        }
        next();
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
};

module.exports = isUserActive;