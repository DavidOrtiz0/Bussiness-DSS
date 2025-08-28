/**
 * Rutas para la colección "Review"
 * 
 * - GET /api/review/business/:businessId       → reseñas de un negocio
 * - GET /api/review/business/:businessId/avg   → promedio de estrellas
 */

const express = require("express");
const router = express.Router();
const reviewCtrl = require("../controllers/review.controller");

// Reseñas de un negocio
router.get("/business/:businessId", reviewCtrl.getReviewsByBusiness);

// Promedio de calificación por negocio
router.get("/business/:businessId/avg", reviewCtrl.getAverageStarsByBusiness);

module.exports = router;
