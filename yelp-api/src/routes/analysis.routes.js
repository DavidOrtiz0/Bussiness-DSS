/**
 * Rutas para el subsistema de análisis (DSS)
 * 
 * - GET /api/analysis/location → análisis de ubicación
 * - GET /api/analysis/demand   → análisis de demanda (palabras clave)
 * - GET /api/analysis/gaps     → análisis de brechas oferta-demanda
 * 
 * Uso con colecciones temporales:
 *   GET /api/analysis/location?temp=true
 *   GET /api/analysis/demand?temp=true
 *   GET /api/analysis/gaps?temp=true
 */

const express = require("express");
const router = express.Router();
const analysisCtrl = require("../controllers/analysis.controller");
const datasetSelector = require("../middleware/datasetSelector");

const Business = require("../models/business.model");
const Review = require("../models/review.model");

// Análisis de ubicación por ciudad y categoría
router.get(
  "/location",
  datasetSelector({ business: Business.schema }),
  analysisCtrl.analyzeLocation
);

// Análisis de demanda en base a reseñas
router.get(
  "/demand",
  datasetSelector({ review: Review.schema }),
  analysisCtrl.analyzeDemand
);

// Análisis de brechas entre reseñas y negocios
router.get(
  "/gaps",
  datasetSelector({ business: Business.schema, review: Review.schema }),
  analysisCtrl.analyzeGaps
);

module.exports = router;
