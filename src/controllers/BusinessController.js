const { Business ,user} = require("../models");

class BusinessController {

  // Create Business
  static async createBusiness(req, res) {
    try {
        console.log(`user id from token: ${req.user.id}`);
      const {title, discription} = req.body;

      const business = await Business.create({
        title,
        discription,
        userid: req.user.id
      });

      return res.status(201).json({
        success: true,
        message: "Business created successfully",
        data: business
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // View All Businesses
  static async getAllBusinesses(req, res) {
    try {
      const businesses = await Business.findAll({
        order: [["id", "DESC"]]
      });

      return res.status(200).json({
        success: true,
        data: businesses
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // View Single Business
  static async getBusinessById(req, res) {
    try {
      const business = await Business.findByPk(req.params.id);

      if (!business) {
        return res.status(404).json({
          success: false,
          message: "Business not found"
        });
      }

      return res.status(200).json({
        success: true,
        data: business
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update Business
     static async updateBusiness(req, res) {
    try {
      const business = await Business.findByPk(req.params.id);

      if (!business) {
        return res.status(404).json({
          success: false,
          message: "Business not found"
        });
      }

      if (business.userid !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can't update this business."
      });
    }

      await business.update(req.body);

      return res.status(200).json({
        success: true,
        message: "Business updated successfully",
        data: business
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getMyBusinesses(req, res) {
    try {
        console.log(`user id from token12: ${req.user.id}`);
        const businesses = await Business.findAll({
            where: {
                userid: req.user.id
            }
        });

        return res.status(200).json({
            success: true,
            data: businesses
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

}

module.exports = BusinessController;