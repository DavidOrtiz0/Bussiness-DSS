/**
 * Controlador de reseñas
 * - Listar reseñas de un negocio
 * - Calcular promedio de estrellas
 */

const Review = require("../models/review.model");

/**
 * Listar reseñas de un negocio
 * Query param: ?limit=10 (default 10)
 */
exports.getReviewsByBusiness = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const reviews = await Review.find({ business_id: req.params.businessId })
      .limit(parseInt(limit, 10))
      .select("review_id stars text date");

    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

/**
 * Promedio de estrellas de un negocio
 */
exports.getAverageStarsByBusiness = async (req, res, next) => {
  try {
    const result = await Review.aggregate([
      { $match: { business_id: req.params.businessId } },
      { $group: { _id: "$business_id", avgStars: { $avg: "$stars" }, total: { $sum: 1 } } }
    ]);

    res.json(result[0] || { avgStars: 0, total: 0 });
  } catch (err) {
    next(err);
  }
};
