/**
 * Rutas para la colección "Tip"
 * 
 * - GET /api/tip/business/:businessId → tips de un negocio
 */

const express = require("express");
const router = express.Router();
const tipCtrl = require("../controllers/tip.controller");
const datasetSelector = require("../middleware/datasetSelector");

// Importar modelo para pasar el schema
const Tip = require("../models/tip.model");

// Tips asociados a un negocio
router.get(
  "/business/:businessId",
  datasetSelector({ tip: Tip.schema }),
  tipCtrl.getTipsByBusiness
);

module.exports = router;
