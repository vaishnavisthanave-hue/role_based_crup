const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");

const   MediaController = require("../controllers/MediaController");

router.post("/", MediaController.createMedia);
module.exports = router;