const express = require("express");
const router = express.Router();
const checkinCtrl = require("../controllers/checkin.controller");

// Número de checkins de un negocio
router.get("/business/:businessId", checkinCtrl.getCheckinCount);

module.exports = router;
