/**
 * Rutas para carga de datasets en colecciones temporales
 * 
 * - POST /api/upload/:collection
 *   (ej: business, review, user, tip, checkin)
 * 
 * Siempre se guardan en colecciones `temp_*`
 * para no modificar los datos originales.
 */

const express = require("express");
const router = express.Router();
const uploadCtrl = require("../controllers/upload.controller");
const upload = require("../middleware/upload");

// Subir archivo JSON a colección temporal
router.post(
  "/:collection",
  upload.single("file"),
  uploadCtrl.uploadDataset // siempre escribe en `temp_*`
);

module.exports = router;
