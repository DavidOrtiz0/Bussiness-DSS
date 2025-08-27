const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");

// Usuario por ID
router.get("/:id", userCtrl.getUserById);

// Top usuarios con más reseñas
router.get("/", userCtrl.getTopUsers);

module.exports = router;
