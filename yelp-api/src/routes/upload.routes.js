/**
 * Rutas para carga de datasets en colecciones temporales
 *
 * - POST /api/upload/:collection
 *   {collection} ∈ business|review|user|tip|checkin
 * - Requiere multipart/form-data con campo "file"
 * - El controlador siempre escribe en colecciones temp_*
 */

const express = require('express');
const multer = require('multer'); // para detectar MulterError
const router = express.Router();

const uploadCtrl = require('../controllers/upload.controller');
const upload = require('../middleware/upload');

// Whitelist de colecciones permitidas
const ALLOWED = new Set(['business', 'review', 'user', 'tip', 'checkin']);

// Normaliza y valida :collection
router.param('collection', (req, res, next, value) => {
  const key = String(value || '').toLowerCase();
  if (!ALLOWED.has(key)) {
    return res.status(400).json({ ok: false, error: 'Colección no permitida' });
  }
  req.params.collection = key;
  next();
});

// POST /api/upload/:collection  (campo "file")
router.post(
  '/:collection',
  upload.single('file'),
  uploadCtrl.uploadDataset
);

// Manejo específico de errores de Multer dentro de este router
router.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Ej.: límite de tamaño, campo faltante, etc.
    return res.status(400).json({ ok: false, error: err.message });
  }
  // Otros errores se delegan al handler global
  next(err);
});

module.exports = router;
