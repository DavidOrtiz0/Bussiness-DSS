/**
 * Rutas para la colección "Business"
 * 
 * - GET /api/business?city=...&category=... → listar negocios con filtros
 * - GET /api/business/:id                   → obtener un negocio por ID
 */

const express = require("express");
const router = express.Router();
const businessCtrl = require("../controllers/business.controller");

// Listar negocios (filtros opcionales por ciudad y categoría)
router.get("/", businessCtrl.getBusinesses);

// Obtener un negocio específico por ID
router.get("/:id", businessCtrl.getBusinessById);

module.exports = router;
