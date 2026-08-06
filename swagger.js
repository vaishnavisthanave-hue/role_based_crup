const swaggerJsdoc = require("swagger-jsdoc");
require("dotenv").config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Role Permission API",
      version: "1.0.0",
      description: "API Documentation",
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;