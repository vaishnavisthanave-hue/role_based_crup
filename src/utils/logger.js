const winston = require("winston");
const path = require("path");
const fs = require("fs");

const logDirectory = path.join(__dirname, "../../logs");

// Create logs folder if it doesn't exist
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, {
    recursive: true
  });
}

const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.errors({
      stack: true
    }),
    winston.format.json()
  ),

  transports: [
    // Terminal
    new winston.transports.Console(),

    // Only ERROR logs
    new winston.transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error"
    }),

    // All logs
    new winston.transports.File({
      filename: path.join(logDirectory, "combined.log")
    })
  ]
});

module.exports = logger;