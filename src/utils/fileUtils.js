const path = require("path");

const getContentType = (type, filename) => {
  const ext = path.extname(filename).toLowerCase();

  const mimeTypes = {
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",

    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".ogg": "audio/ogg",

    ".pdf": "application/pdf",
    ".txt": "text/plain",
    ".zip": "application/zip",

    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };

  return mimeTypes[ext] || "application/octet-stream";
};

module.exports = getContentType;