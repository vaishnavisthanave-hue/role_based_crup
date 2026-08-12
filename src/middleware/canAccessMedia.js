const { Media, Role } = require("../models");

const canAccessMedia = async (req, res, next) => {
  try {
    const media = await Media.findByPk(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found"
      });
    }

    const role = await Role.findByPk(req.user.roleid);

    // Admin can access any media
    if (role && role.name.toLowerCase() === "admin") {
      req.media = media;
      return next();
    }

    // Resource owner can access media
    console.log(media.userid, req.user.id); // Debugging line
    if (media.userid !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this media"
      });
    }

    req.media = media;

    next();

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = canAccessMedia;