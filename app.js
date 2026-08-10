require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./swagger");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const businessRoutes = require("./src/routes/businessRoutes");
const mediaRoutes = require("./src/routes/mediaRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));
// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/business", businessRoutes);
app.use("/media", mediaRoutes);


// Root route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the Node.js MVC Application!"
    });
});


app.use((err, req, res, next) => {
    console.error(err);

    // Multer errors
    if (err.name === "MulterError") {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    // File type validation errors
    if (err.message === "Only image and video files are allowed.") {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    // Default error response
    return res.status(err.status || 500).json({
        success: false,
        message: "Internal server error."
    });
});


// Start server (ALWAYS LAST)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

