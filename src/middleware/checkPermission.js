const { User, Permission,Role} = require("../models");

const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [
          {
            model: Permission
          }
        ]
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
       const role = await Role.findByPk(req.user.roleid);
       
       if (role && role.name.toLowerCase() === "admin") {
        return next();
      }
      const hasPermission = user.Permissions.some(
        permission => permission.name === permissionName
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission."
        });
      }

      next();

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
};

module.exports = checkPermission;