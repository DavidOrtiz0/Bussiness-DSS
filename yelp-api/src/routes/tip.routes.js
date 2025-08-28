/**
 * Rutas para la colección "Tip"
 * 
 * - GET /api/tip/business/:businessId → tips de un negocio
 */

const express = require("express");
const router = express.Router();
const tipCtrl = require("../controllers/tip.controller");

// Tips asociados a un negocio
router.get("/business/:businessId", tipCtrl.getTipsByBusiness);

module.exports = router;
