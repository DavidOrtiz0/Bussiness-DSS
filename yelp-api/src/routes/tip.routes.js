const express = require("express");
const router = express.Router();
const tipCtrl = require("../controllers/tip.controller");

// Tips de un negocio
router.get("/business/:businessId", tipCtrl.getTipsByBusiness);

module.exports = router;
