const { User, Role } = require("../models");

class UserController {
  static async getAllVendors(req, res) {
    try {
      const vendorRole = await Role.findOne({
        where: { name: "vendor" }
      });

      if (!vendorRole) {
        return res.status(404).json({
          success: false,
          message: "Vendor role not found"
        });
      }

     
      const vendors = await User.findAll({
        where: {
          roleid: vendorRole.id
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