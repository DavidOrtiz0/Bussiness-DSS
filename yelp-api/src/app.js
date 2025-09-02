/**
 * Archivo principal de configuración de la aplicación Express
 *
 * - Middlewares globales (CORS, logging, JSON parsing)
 * - Rutas de la API (business, review, user, tip, checkin, analysis, upload, export)
 * - Swagger UI (/api-docs)
 * - Manejo centralizado de errores y 404
 */

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Rutas
const businessRoutes = require('./routes/business.routes');
const reviewRoutes = require('./routes/review.routes');
const userRoutes = require('./routes/user.routes');
const tipRoutes = require('./routes/tip.routes');
const checkinRoutes = require('./routes/checkin.routes');
const analysisRoutes = require('./routes/analysis.routes');
const uploadRoutes = require('./routes/upload.routes');
const exportRoutes = require('./routes/export.routes');

// Middlewares
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// Swagger doc
const swaggerDocument = YAML.load('./src/config/swagger.yaml');

const app = express();

/* ---------------------- Middlewares globales ---------------------- */

// JSON: los datasets entran por Multer; aquí solo bodies pequeños
app.use(express.json({ limit: '1mb' }));

// Logger
app.use(morgan('dev'));

// CORS explícito
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/* ---------------------- Healthcheck ------------------------------- */

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, service: 'yelp-dss-api' })
);

/* ---------------------- Rutas principales ------------------------- */

// Upload (datasets temporales)
app.use('/api/upload', uploadRoutes);

// Export (CSV/PDF)
app.use('/api/export', exportRoutes);

// Recursos
app.use('/api/business', businessRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tip', tipRoutes);
app.use('/api/checkin', checkinRoutes);

// Análisis DSS
app.use('/api/analysis', analysisRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Raíz
app.get('/', (_req, res) => {
  res.json({ message: '✅ API Yelp funcionando correctamente' });
});

/* ---------------------- Manejo de errores ------------------------- */

// 404
app.use(notFound);

// Handler centralizado
app.use(errorHandler);

module.exports = app;
