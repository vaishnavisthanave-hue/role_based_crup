require('dotenv').config();

const express = require('express');

const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use(express.json());
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const businessRoutes = require("./src/routes/businessRoutes");
const mediaRoutes = require("./src/routes/mediaRouters");

app.use("/business", businessRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/media", mediaRoutes);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Welcome to the Node.js MVC Application!');
});