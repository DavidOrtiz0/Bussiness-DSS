const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const businessRoutes = require("./routes/business.routes");
const reviewRoutes = require("./routes/review.routes");
const userRoutes = require("./routes/user.routes");
const tipRoutes = require("./routes/tip.routes");
const checkinRoutes = require("./routes/checkin.routes");
const analysisRoutes = require("./routes/analysis.routes");

const swaggerDocument = YAML.load("./src/config/swagger.yaml");

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas
app.use("/api/business", businessRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tip", tipRoutes);
app.use("/api/checkin", checkinRoutes);
app.use("/api/analysis", analysisRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Yelp funcionando" });
});

module.exports = app;
