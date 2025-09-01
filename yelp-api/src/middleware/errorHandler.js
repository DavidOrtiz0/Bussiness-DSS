/**
 * Middleware de manejo centralizado de errores
 *
 * - Captura cualquier error lanzado en la aplicación.
 * - Devuelve respuestas JSON consistentes.
 * - En desarrollo incluye el stack trace.
 */

function errorHandler(err, req, res, next) {
  console.error("🔥 Error capturado:", err);

  const status = err.status || 500;

  res.status(status).json({
    error: err.message || "Error interno del servidor",
    path: req.originalUrl,
    // Solo mostrar stack en desarrollo (ocultar en producción)
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
}

module.exports = errorHandler;
