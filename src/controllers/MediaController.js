const { Role, Media } = require("../models");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const sharp = require("sharp");
const getContentType = require("../utils/fileUtils");

const {
    generateFileHash,
    generateImageThumbnail,
    optimizeImage,
    generateVideoThumbnail,
} = require("../utils/mediaUtils");

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
            let thumbnail = null;
            let videoHash = null;
            let videoThumbnail = null;

            // Duplicate image check
            if (image) {

                const imagePath = path.join(
                    __dirname,
                    "../uploads",
                    image
                );

                const tempPath = path.join(
                    __dirname,
                    "../uploads",
                    `temp-${image}`
                );

                const thumbnailName = `thumb-${image}`;
                thumbnail = thumbnailName;

                const thumbnailPath = path.join(
                    __dirname,
                    "../uploads",
                    thumbnailName
                );


                // Original uploaded image ko temporary file banao
                fs.renameSync(
                    imagePath,
                    tempPath
                );


                // Optimize image
                await optimizeImage(
                    tempPath,
                    imagePath
                );


                // Generate thumbnail
                await generateImageThumbnail(
                    imagePath,
                    thumbnailPath
                );


                // Temporary file delete
                fs.unlinkSync(tempPath);


                // Generate hash
                fileHash = generateFileHash(
                    imagePath
                );


                // Duplicate check
                const exists = await Media.findOne({
                    where: {
                        fileHash,
                    },
                });


                if (exists) {

                    fs.unlinkSync(imagePath);
                    fs.unlinkSync(thumbnailPath);

                    return res.status(400).json({
                        success: false,
                        message: "This image has already been uploaded.",
                    });
                }
            }
            if (video) {

                const videoPath = path.join(
                    __dirname,
                    "../uploads",
                    video
                );

                const videoName = path.parse(video).name;

                videoThumbnail = `thumb-${videoName}.jpg`;
                thumbnail = videoThumbnail;

                const thumbnailPath = path.join(
                    __dirname,
                    "../uploads",
                    videoThumbnail
                );


                // Generate video thumbnail
                await generateVideoThumbnail(
                    videoPath,
                    thumbnailPath
                );


                // Generate video hash
                videoHash = generateFileHash(
                    videoPath
                );


                // Duplicate video check
                const exists = await Media.findOne({
                    where: {
                        fileHash: videoHash,
                    },
                });



                if (exists) {

                    fs.unlinkSync(videoPath);

                    if (fs.existsSync(thumbnailPath)) {
                        fs.unlinkSync(thumbnailPath);
                    }

                    return res.status(400).json({
                        success: false,
                        message: "This video has already been uploaded.",
                    });
                }
            }


            if (file) {

                const filePath = path.join(
                    __dirname,
                    "../uploads",
                    file
                );


                fileHash = generateFileHash(
                    filePath
                );


                const exists = await Media.findOne({
                    where: {
                        fileHash,
                    },
                });


                if (exists) {

                    fs.unlinkSync(filePath);

                    return res.status(400).json({
                        success: false,
                        message: "This file has already been uploaded.",
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
                thumbnail,
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
            
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },

    async streamMedia(req, res) {
        try {
            const { type, filename } = req.params;
            const allowedTypes = ["video", "audio", "file"];
            if (!allowedTypes.includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid media type",
                });
            }

            const filePath = path.join(
                __dirname,
                "../uploads",
                filename
            );

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    message: "File not found",
                });
            }

            const stat = fs.statSync(filePath);
            const fileSize = stat.size;

            const range = req.headers.range;

            if (!range) {
                res.writeHead(200, {
                    "Content-Length": fileSize,
                    "Accept-Ranges": "bytes",
                    "Content-Type": getContentType(type, filename),
                });

                fs.createReadStream(filePath).pipe(res);

                return;
            }

            const parts = range.replace(/bytes=/, "").split("-");

            const start = parseInt(parts[0], 10);

            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize - 1;

            if (
                Number.isNaN(start) ||
                Number.isNaN(end) ||
                start > end ||
                start >= fileSize
            ) {
                return res.status(416).set({
                    "Content-Range": `bytes */${fileSize}`,
                }).end();
            }

            const chunkSize = end - start + 1;

            const stream = fs.createReadStream(filePath, {
                start,
                end,
            });

            res.writeHead(206, {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunkSize,
                "Content-Type": getContentType(type, filename),
            });

            stream.pipe(res);

        } catch (error) {
            console.error("Stream Media Error:", error);

            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },

     async getMedia(req, res) {
  try {
    return res.status(200).json({
      success: true,
      data: req.media
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
};

module.exports = MediaController;