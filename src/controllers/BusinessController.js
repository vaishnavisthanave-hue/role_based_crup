const { Business ,user} = require("../models");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

class BusinessController {

  // Create Business
 static async createBusiness(req, res) {
  try {
    const { title, discription } = req.body;

    const image = req.files?.image?.[0]?.filename || null;
    const video = req.files?.video?.[0]?.filename || null;

    let fileHash = null;

    if (image) {
      const imagePath = path.join(__dirname, "../uploads", image);

      const buffer = fs.readFileSync(imagePath);
      fileHash = crypto.createHash("sha256").update(buffer).digest("hex");

      const exists = await Business.findOne({
        where: { fileHash }
      });

      if (exists) {
        fs.unlinkSync(imagePath);

        return res.status(400).json({
          success: false,
          message: "This image has already been uploaded."
        });
      }
    }

    let imageSize = 0;
    let videoSize = 0;

    // Image size
    if (image) {
      const imagePath = path.join(__dirname, "../uploads", image);
      imageSize = fs.statSync(imagePath).size; // bytes
    }

    // Video size
    if (video) {
      const videoPath = path.join(__dirname, "../uploads", video);
      videoSize = fs.statSync(videoPath).size; // bytes
    }

    // Compare sizes
    if (image && video) {
      if (imageSize === videoSize) {
        return res.status(400).json({
          success: false,
          message: "Image and video have the same file size."
        });
      }
    }
    const business = await Business.create({
      title,
      discription,
      userid: req.user.id,
      image,
      video,
      fileHash
    });

    return res.status(201).json({
      success: true,
      message: "Business created successfully",
      data: business,
      mageSize: `${(imageSize / 1024).toFixed(2)} KB`,
      videoSize: `${(videoSize / 1024).toFixed(2)} KB`,
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

    const data = {
      title: req.body.title || business.title,
      discription: req.body.discription || business.discription
    };

    // Update Image
    if (req.files?.image) {
      const newImage = req.files.image[0].filename;

      const newImagePath = path.join(__dirname, "../uploads", newImage);
      const oldImagePath = business.image
        ? path.join(__dirname, "../uploads", business.image)
        : null;

      const newHash = crypto
        .createHash("sha256")
        .update(fs.readFileSync(newImagePath))
        .digest("hex");

      let oldHash = null;

      if (oldImagePath && fs.existsSync(oldImagePath)) {
        oldHash = crypto
          .createHash("sha256")
          .update(fs.readFileSync(oldImagePath))
          .digest("hex");
      }

      if (newHash === oldHash) {
        // Same image uploaded, remove newly uploaded file
        fs.unlinkSync(newImagePath);
      } else {
        // Delete old image
        if (oldImagePath && fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

        data.image = newImage;
      }
    }

    // Update Video
    if (req.files?.video) {
      const newVideo = req.files.video[0].filename;

      if (business.video) {
        const oldVideoPath = path.join(
          __dirname,
          "../uploads",
          business.video
        );

        if (fs.existsSync(oldVideoPath)) {
          fs.unlinkSync(oldVideoPath);
        }
      }

      data.video = newVideo;
    }

    await business.update(data);

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