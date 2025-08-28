/**
 * Rutas para carga de datasets en colecciones temporales
 * 
 * - POST /api/upload/:collection
 *   (ej: business, review, user, tip, checkin)
 */

const express = require("express");
const router = express.Router();
const uploadCtrl = require("../controllers/upload.controller");
const upload = require("../middleware/upload");

// Subir archivo JSON a colección temporal
router.post("/:collection", upload.single("file"), uploadCtrl.uploadDataset);

module.exports = router;
