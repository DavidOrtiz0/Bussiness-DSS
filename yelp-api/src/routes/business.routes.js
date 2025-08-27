const express = require("express");
const router = express.Router();
const businessCtrl = require("../controllers/business.controller");

// Listar negocios (filtros: city, category)
router.get("/", businessCtrl.getBusinesses);

// Detalle de negocio por ID
router.get("/:id", businessCtrl.getBusinessById);

module.exports = router;
