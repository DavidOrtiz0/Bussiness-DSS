/**
 * Rutas para exportación de datos en diferentes formatos
 * 
 * - GET /api/export/csv → exportar en CSV
 * - GET /api/export/pdf → exportar en PDF
 */

const express = require("express");
const router = express.Router();
const exportCtrl = require("../controllers/export.controller");

// Exportar datos en formato CSV
router.get("/csv", exportCtrl.exportCSV);

// Exportar datos en formato PDF
router.get("/pdf", exportCtrl.exportPDF);

module.exports = router;
