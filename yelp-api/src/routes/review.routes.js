/**
 * Rutas para la colección "Review"
 * 
 * - GET /api/review/business/:businessId       → reseñas de un negocio
 * - GET /api/review/business/:businessId/avg   → promedio de estrellas
 * 
 * Uso con colecciones temporales:
 *   GET /api/review/business/:businessId?temp=true
 *   GET /api/review/business/:businessId/avg?temp=true
 */

const express = require("express");
const router = express.Router();
const reviewCtrl = require("../controllers/review.controller");
const datasetSelector = require("../middleware/datasetSelector");

// Importar modelo para pasar el schema
const Review = require("../models/review.model");

// Reseñas de un negocio
router.get(
  "/business/:businessId",
  datasetSelector({ review: Review.schema }),
  reviewCtrl.getReviewsByBusiness
);

// Promedio de calificación por negocio
router.get(
  "/business/:businessId/avg",
  datasetSelector({ review: Review.schema }),
  reviewCtrl.getAverageStarsByBusiness
);

module.exports = router;
