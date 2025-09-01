/**
 * Middleware de carga de archivos con Multer
 *
 * - Almacena los archivos subidos en el directorio `uploads/`.
 * - Genera un nombre único usando timestamp + extensión original.
 * - Solo se acepta formato JSON (para datasets).
 */

const multer = require("multer");
const path = require("path");

// Configuración del almacenamiento en disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// Filtro para aceptar solo archivos JSON
const fileFilter = (req, file, cb) => {
  if (file.mimetype !== "application/json") {
    return cb(new Error("Solo se permiten archivos JSON"), false);
  }
  cb(null, true);
};

// Inicialización de Multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Máx 5 MB
});

module.exports = upload;
