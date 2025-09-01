/**
 * Rutas para exportación de datos en diferentes formatos
 * 
 * - GET /api/export/csv → exportar en CSV
 * - GET /api/export/pdf → exportar en PDF
 * 
 * Uso con colecciones temporales:
 *   GET /api/export/csv?report=top-business&temp=true
 *   GET /api/export/pdf?report=top-users&temp=true
 */

const express = require("express");
const router = express.Router();
const exportCtrl = require("../controllers/export.controller");
const datasetSelector = require("../middleware/datasetSelector");

// Importar modelos para pasar sus schemas
const Business = require("../models/business.model");
const User = require("../models/user.model");
const Review = require("../models/review.model");

// Exportar datos en formato CSV
router.get(
  "/csv",
  datasetSelector({ business: Business.schema, user: User.schema, review: Review.schema }),
  exportCtrl.exportCSV
);

// Exportar datos en formato PDF
router.get(
  "/pdf",
  datasetSelector({ business: Business.schema, user: User.schema, review: Review.schema }),
  exportCtrl.exportPDF
);

module.exports = router;
