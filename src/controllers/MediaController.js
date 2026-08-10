const { Role, Media } = require("../models");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const MediaController = {
  async createMedia(req, res) {
    try {
      console.log("req.user:", req.user);
      console.log("req.files:", req.files);

      // Check vendor role
      const role = await Role.findOne({
        where: {
          id: req.user.roleid,
          name: "vendor",
        },
      });

      if (!role) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to upload media.",
        });
      }

      // Get uploaded files
      const image = req.files?.image?.[0]?.filename || null;
      const video = req.files?.video?.[0]?.filename || null;
      const audio = req.files?.audio?.[0]?.filename || null;
      const file = req.files?.file?.[0]?.filename || null;

      if (!image && !video && !audio && !file) {
        return res.status(400).json({
          success: false,
          message: "Please upload at least one file.",
        });
      }

      let fileHash = null;

      // Duplicate image check
      if (image) {
        const imagePath = path.join(__dirname, "../uploads", image);

        const buffer = fs.readFileSync(imagePath);

        fileHash = crypto
          .createHash("sha256")
          .update(buffer)
          .digest("hex");

        const exists = await Media.findOne({
          where: {
            fileHash,
          },
        });

        if (exists) {
          fs.unlinkSync(imagePath);

          return res.status(400).json({
            success: false,
            message: "This image has already been uploaded.",
          });
        }
      }

      // Image size
      let imageSize = 0;

      if (image) {
        const imagePath = path.join(__dirname, "../uploads", image);
        imageSize = fs.statSync(imagePath).size;
      }

      // Video size
      let videoSize = 0;

      if (video) {
        const videoPath = path.join(__dirname, "../uploads", video);
        videoSize = fs.statSync(videoPath).size;
      }

      // Audio size
      let audioSize = 0;

      if (audio) {
        const audioPath = path.join(__dirname, "../uploads", audio);
        audioSize = fs.statSync(audioPath).size;
      }

      // File size
      let fileSize = 0;

      if (file) {
        const filePath = path.join(__dirname, "../uploads", file);
        fileSize = fs.statSync(filePath).size;
      }

      // Create media record
      const media = await Media.create({
        image,
        video,
        audio,
        file,
        fileHash,
        userid: req.user.id,
      });

      return res.status(201).json({
        success: true,
        message: "Media created successfully",
        data: media,

        imageSize: image
          ? `${(imageSize / 1024).toFixed(2)} KB`
          : null,

        videoSize: video
          ? `${(videoSize / 1024).toFixed(2)} KB`
          : null,

        audioSize: audio
          ? `${(audioSize / 1024).toFixed(2)} KB`
          : null,

        fileSize: file
          ? `${(fileSize / 1024).toFixed(2)} KB`
          : null,
      });
    } catch (error) {
      console.error("Create Media Error:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = MediaController;