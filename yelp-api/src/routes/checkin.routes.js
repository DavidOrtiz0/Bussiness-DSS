/**
 * Rutas para la colección "Checkin"
 * 
 * - GET /api/checkin/business/:businessId → total de checkins de un negocio
 */

const express = require("express");
const router = express.Router();
const checkinCtrl = require("../controllers/checkin.controller");

// Obtener total de checkins por negocio
router.get("/business/:businessId", checkinCtrl.getCheckinCount);

module.exports = router;
