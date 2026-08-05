const { User, Role } = require("../models");

class UserController {
  static async getAllVendors(req, res) {
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
        message: "You do not have permission to show all vendor."
    });
}
      // Vendor role find karo
      const vendorRole = await Role.findOne({
        where: { name: "Vendor" } // agar column roleName hai to roleName likho
      });

      if (!vendorRole) {
        return res.status(404).json({
          success: false,
          message: "Vendor role not found"
        });
      }

      // Sirf vendor users lao
      const vendors = await User.findAll({
        where: {
          roleId: vendorRole.id
        },
        attributes: {
          exclude: ["password"]
        }
      });

      return res.status(200).json({
        success: true,
        data: vendors
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = UserController;