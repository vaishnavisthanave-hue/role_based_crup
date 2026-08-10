const fs = require("fs");
const crypto = require("crypto");
const sharp = require("sharp");
const { execFile } = require("child_process");


// ===============================
// FILE HASH
// ===============================

const generateFileHash = (filePath) => {
  const buffer = fs.readFileSync(filePath);

  return crypto
    .createHash("sha256")
    .update(buffer)
    .digest("hex");
};


// ===============================
// IMAGE OPTIMIZATION
// ===============================

const optimizeImage = async (inputPath, outputPath) => {

  await sharp(inputPath)
    .resize({
      width: 1920,
      height: 1080,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 80,
      mozjpeg: true,
    })
    .toFile(outputPath);
};


// ===============================
// IMAGE THUMBNAIL
// ===============================

const generateImageThumbnail = async (
  imagePath,
  thumbnailPath
) => {

  await sharp(imagePath)
    .resize(300, 169, {
      fit: "cover",
    })
    .jpeg({
      quality: 70,
    })
    .toFile(thumbnailPath);
};


// ===============================
// VIDEO THUMBNAIL
// ===============================

const generateVideoThumbnail = (videoPath, thumbnailPath) => {
  return new Promise((resolve, reject) => {
    execFile(
      "ffmpeg",
      [
        "-y",
        "-i",
        videoPath,
        "-vf",
        "scale=300:-1",
        "-frames:v",
        "1",
        "-q:v",
        "5",
        "-update",
        "1",
        thumbnailPath,
      ],
      (error, stdout, stderr) => {
        if (error) {
          console.error("FFmpeg Error:");
          console.error(stderr);

          return reject(new Error(stderr));
        }

        console.log("Video thumbnail created:", thumbnailPath);

        resolve();
      }
    );
  });
};


module.exports = {
  generateFileHash,
  optimizeImage,
  generateImageThumbnail,
  generateVideoThumbnail,
};