/**
 * Rutas para el subsistema de análisis (DSS)
 * 
 * - GET /api/analysis/location → análisis de ubicación
 * - GET /api/analysis/demand   → análisis de demanda (palabras clave)
 * - GET /api/analysis/gaps     → análisis de brechas oferta-demanda
 */

const express = require("express");
const router = express.Router();
const analysisCtrl = require("../controllers/analysis.controller");

// Análisis de ubicación por ciudad y categoría
router.get("/location", analysisCtrl.analyzeLocation);

// Análisis de demanda en base a reseñas
router.get("/demand", analysisCtrl.analyzeDemand);

// Análisis de brechas entre reseñas y negocios
router.get("/gaps", analysisCtrl.analyzeGaps);

module.exports = router;
