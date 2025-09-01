/**
 * Rutas para la colección "Checkin"
 * 
 * - GET /api/checkin/business/:businessId → total de checkins de un negocio
 * 
 * Uso con colecciones temporales:
 *   GET /api/checkin/business/:businessId?temp=true
 */

const express = require("express");
const router = express.Router();
const checkinCtrl = require("../controllers/checkin.controller");
const datasetSelector = require("../middleware/datasetSelector");
const Checkin = require("../models/checkin.model");

// Obtener total de checkins por negocio
router.get(
  "/business/:businessId",
  datasetSelector({ checkin: Checkin.schema }),
  checkinCtrl.getCheckinCount
);

module.exports = router;
