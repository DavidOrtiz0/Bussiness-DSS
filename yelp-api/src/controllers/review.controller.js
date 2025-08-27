const Review = require("../models/review.model");

// Reseñas de un negocio (solo texto, stars, fecha)
exports.getReviewsByBusiness = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const reviews = await Review.find({ business_id: req.params.businessId })
      .limit(parseInt(limit))
      .select("review_id stars text date");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Promedio de estrellas de un negocio (útil para DSS)
exports.getAverageStarsByBusiness = async (req, res) => {
  try {
    const result = await Review.aggregate([
      { $match: { business_id: req.params.businessId } },
      { $group: { _id: "$business_id", avgStars: { $avg: "$stars" }, total: { $sum: 1 } } }
    ]);
    res.json(result[0] || { avgStars: 0, total: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
