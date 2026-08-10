const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const checkPermission = require("../middleware/checkPermission");

const MediaController = require("../controllers/MediaController");
const upload = require("../middleware/upload");
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "audio", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  MediaController.createMedia
);
router.get(
  "/stream/:type/:filename",

  MediaController.streamMedia
);
module.exports = router;