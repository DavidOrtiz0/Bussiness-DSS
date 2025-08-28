/**
 * Archivo principal de configuración de la aplicación Express
 * 
 * Este archivo se encarga de:
 * - Configurar middlewares globales (CORS, logging, JSON parsing).
 * - Definir las rutas de la API (business, reviews, users, etc.).
 * - Integrar Swagger para la documentación interactiva.
 * - Manejar errores y rutas no encontradas de manera centralizada.
 */

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

// Importación de rutas
const businessRoutes = require("./routes/business.routes");
const reviewRoutes = require("./routes/review.routes");
const userRoutes = require("./routes/user.routes");
const tipRoutes = require("./routes/tip.routes");
const checkinRoutes = require("./routes/checkin.routes");
const analysisRoutes = require("./routes/analysis.routes");
const uploadRoutes = require("./routes/upload.routes");
const exportRoutes = require("./routes/export.routes");

// Importación de middlewares
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

// Documentación con Swagger
const swaggerDocument = YAML.load("./src/config/swagger.yaml");

const app = express();

/* ---------------------- Middlewares globales ---------------------- */

// Parseo de JSON en requests
app.use(express.json());

// Logger HTTP en modo desarrollo
app.use(morgan("dev"));

// Habilitar CORS para peticiones desde frontends externos
app.use(cors());

/* ---------------------- Rutas principales ------------------------- */

// Rutas de carga de datasets
app.use("/api/upload", uploadRoutes);

// Rutas de exportación de reportes
app.use("/api/export", exportRoutes);

// Rutas de recursos principales
app.use("/api/business", businessRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tip", tipRoutes);
app.use("/api/checkin", checkinRoutes);
app.use("/api/analysis", analysisRoutes);

// Documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Endpoint base para verificar funcionamiento de la API
app.get("/", (req, res) => {
  res.json({ message: "✅ API Yelp funcionando correctamente" });
});

/* ---------------------- Manejo de errores ------------------------- */

// Middleware para rutas no encontradas (404)
app.use(notFound);

// Middleware centralizado para captura y respuesta de errores
app.use(errorHandler);

module.exports = app;
