const { Business, Role } = require("../models");

const canAccessBusiness = async (req, res, next) => {
  try {
    const business = await Business.findByPk(req.params.id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found"
      });
    }

    const role = await Role.findByPk(req.user.roleid);

    // Admin can access any business
    if (role && role.name.toLowerCase() === "admin") {
      req.business = business;
      return next();
    }

    // Resource owner can access
    if (business.userid !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this business"
      });
    }

    req.business = business;

    next();

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = canAccessBusiness;