/**
 * Rutas para la colección "User"
 * 
 * - GET /api/user/:id        → obtener un usuario por ID
 * - GET /api/user            → obtener top usuarios más activos
 */

const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");

// Obtener usuario por ID
router.get("/:id", userCtrl.getUserById);

// Top usuarios con más reseñas
router.get("/", userCtrl.getTopUsers);

module.exports = router;
