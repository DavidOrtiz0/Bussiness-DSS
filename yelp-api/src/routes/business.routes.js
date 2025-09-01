// business.routes.js
const express = require("express");
const router = express.Router();
const businessCtrl = require("../controllers/business.controller");
const datasetSelector = require("../middleware/datasetSelector");
const Business = require("../models/business.model");

// Listar negocios
router.get(
  "/",
  datasetSelector({ business: Business.schema }), // ✅ CORRECTO
  businessCtrl.getBusinesses
);

// Obtener un negocio específico por ID
router.get(
  "/:id",
  datasetSelector({ business: Business.schema }), // ✅ CORRECTO
  businessCtrl.getBusinessById
);

module.exports = router;
