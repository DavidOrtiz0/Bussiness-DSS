const express = require("express");
const router = express.Router();
const analysisCtrl = require("../controllers/analysis.controller");

// Análisis de ubicación (city + category)
router.get("/location", analysisCtrl.analyzeLocation);

// Análisis de demanda (keywords en reseñas)
router.get("/demand", analysisCtrl.analyzeDemand);

// Análisis de brechas (reviews vs negocios en ciudad)
router.get("/gaps", analysisCtrl.analyzeGaps);

module.exports = router;
