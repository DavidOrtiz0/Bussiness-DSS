const express = require("express");
const router = express.Router();
const reviewCtrl = require("../controllers/review.controller");

// Reseñas de un negocio
router.get("/business/:businessId", reviewCtrl.getReviewsByBusiness);

// Promedio de estrellas de un negocio
router.get("/business/:businessId/avg", reviewCtrl.getAverageStarsByBusiness);

module.exports = router;
