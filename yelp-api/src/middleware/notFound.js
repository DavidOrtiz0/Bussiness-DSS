/**
 * Middleware para rutas no encontradas
 *
 * - Se ejecuta cuando ninguna ruta coincide.
 * - Devuelve un error 404 consistente en formato JSON.
 */

function notFound(req, res, next) {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.originalUrl
  });
}

module.exports = notFound;
