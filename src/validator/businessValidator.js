const validateCreateBusiness = (req, res, next) => {
    try {
        const { title, discription } = req.body;

        // Required fields
        if (!title || !discription) {
            return res.status(400).json({
                success: false,
                message: "Title and discription are required."
            });
        }

        // String validation
        if (
            typeof title !== "string" ||
            typeof discription !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Title and discription must be strings."
            });
        }

        // Trim validation
        if (
            title.trim().length < 2 ||
            title.trim().length > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Title must be between 2 and 100 characters."
            });
        }

        if (
            discription.trim().length < 5 ||
            discription.trim().length > 1000
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Discription must be between 5 and 1000 characters."
            });
        }

        // User authentication check
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized."
            });
        }

        // File validation
        const image = req.files?.image?.[0];
        const video = req.files?.video?.[0];

        if (!image && !video) {
            return res.status(400).json({
                success: false,
                message: "Image or video is required."
            });
        }

        // Image MIME validation
        if (image) {
            const allowedImageTypes = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            if (!allowedImageTypes.includes(image.mimetype)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Only JPEG, PNG and WEBP images are allowed."
                });
            }
        }

        // Video MIME validation
        if (video) {
            const allowedVideoTypes = [
                "video/mp4",
                "video/mpeg",
                "video/webm"
            ];

            if (!allowedVideoTypes.includes(video.mimetype)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Only MP4, MPEG and WEBM videos are allowed."
                });
            }
        }

        // Image size - 5 MB
        if (image && image.size > 5 * 1024 * 1024) {
            return res.status(400).json({
                success: false,
                message: "Image size cannot exceed 5 MB."
            });
        }

        // Video size - 50 MB
        if (video && video.size > 50 * 1024 * 1024) {
            return res.status(400).json({
                success: false,
                message: "Video size cannot exceed 50 MB."
            });
        }

        next();

    } catch (error) {
        next(error);
    }
};

module.exports = validateCreateBusiness;