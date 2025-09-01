/**
 * Controlador de Reseñas
 * - Listar reseñas de un negocio
 * - Calcular promedio de estrellas
 *
 * ✅ Refactor:
 * Usa `req.db.review` en lugar del modelo estático para
 * soportar tanto colecciones reales como temporales (?temp=true).
 */

 /**
  * Listar reseñas de un negocio
  * @route GET /api/review/business/:businessId?limit=10&temp=true
  */
exports.getReviewsByBusiness = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const reviews = await req.db.review.find({ business_id: req.params.businessId })
      .limit(parseInt(limit, 10))
      .select("review_id stars text date");

    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

/**
 * Promedio de estrellas de un negocio
 * @route GET /api/review/business/:businessId/avg?temp=true
 */
exports.getAverageStarsByBusiness = async (req, res, next) => {
  try {
    const result = await req.db.review.aggregate([
      { $match: { business_id: req.params.businessId } },
      { $group: { _id: "$business_id", avgStars: { $avg: "$stars" }, total: { $sum: 1 } } }
    ]);

    res.json(result[0] || { avgStars: 0, total: 0 });
  } catch (err) {
    next(err);
  }
};
