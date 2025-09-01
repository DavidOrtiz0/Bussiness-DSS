/**
 * Middleware dinámico para seleccionar entre colecciones originales o temporales.
 *
 * Permite usar:
 *   - Colecciones originales (business, review, user, tip, checkin)
 *   - Colecciones temporales (temp_business, temp_review, etc.)
 *
 * Ejemplo:
 *   datasetSelector({ business: Business.schema, review: Review.schema })
 *
 * Luego estarán disponibles en:
 *   req.db.business
 *   req.db.review
 */

const mongoose = require("mongoose");

function datasetSelector(models) {
  return (req, res, next) => {
    try {
      if (!req.db) req.db = {};

      const useTemp = req.query.temp === "true";

      for (const [name, schema] of Object.entries(models)) {
        const collectionName = useTemp ? `temp_${name}` : name;

        // Creamos un modelo dinámico en base al schema
        req.db[name] =
          mongoose.models[collectionName] ||
          mongoose.model(collectionName, schema, collectionName);

        req.collectionName = collectionName; // opcional, debug
      }

      next();
    } catch (err) {
      console.error("❌ Error en datasetSelector:", err);
      res.status(500).json({ error: "Error seleccionando dataset" });
    }
  };
}

module.exports = datasetSelector;
