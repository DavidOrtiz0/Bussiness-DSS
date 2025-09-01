/**
 * Rutas para la colección "User"
 * 
 * - GET /api/user/:id        → obtener un usuario por ID
 * - GET /api/user            → obtener top usuarios más activos
 */

const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const datasetSelector = require("../middleware/datasetSelector");

// Importamos el modelo para pasar su schema
const User = require("../models/user.model");

// Obtener usuario por ID
router.get("/:id",
  datasetSelector({ user: User.schema }),
  userCtrl.getUserById
);

// Top usuarios con más reseñas
router.get("/",
  datasetSelector({ user: User.schema }),
  userCtrl.getTopUsers
);

module.exports = router;
