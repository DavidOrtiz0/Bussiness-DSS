/**
 * Middleware de carga de archivos con Multer (JSON)
 *
 * - Guarda en /uploads (se crea si no existe)
 * - Nombre único: timestamp + nombre-saneado + .json
 * - Acepta JSON por mimetype o por extensión .json
 * - Límite 5MB
 */

const fs = require('fs');
const path = require('path');
const multer = require('multer');

const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');

// Asegura carpeta de uploads
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Util: mimetypes JSON comunes
const JSON_MIMES = new Set([
  'application/json',
  'application/x-json',
  'text/json',
]);

const isJsonMime = (m) => (m && JSON_MIMES.has(m.toLowerCase()));
const isJsonExt  = (filename) => path.extname(filename || '').toLowerCase() === '.json';

// Sanea nombre base (sin rutas, sin caracteres raros)
function sanitizeBaseName(originalname) {
  const base = path.basename(originalname, path.extname(originalname));
  return base
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')   // sólo [a-z0-9._-]
    .replace(/^-+|-+$/g, '')          // trim guiones
    || 'dataset';
}

// Almacenamiento en disco
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const safe = sanitizeBaseName(file.originalname);
    const name = `${Date.now()}-${safe}.json`;
    cb(null, name);
  },
});

// Filtro: sólo JSON por mimetype o extensión
const fileFilter = (_req, file, cb) => {
  if (isJsonMime(file.mimetype) || isJsonExt(file.originalname)) {
    return cb(null, true);
  }
  return cb(new Error('Solo se permiten archivos JSON'), false);
};

// Inicializa Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
});

module.exports = upload;
