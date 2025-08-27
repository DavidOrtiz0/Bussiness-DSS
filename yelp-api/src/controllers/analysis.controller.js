const Business = require("../models/business.model");
const Review = require("../models/review.model");
const Checkin = require("../models/checkin.model");

// Análisis de ubicación: negocios por ciudad + categoría
exports.analyzeLocation = async (req, res) => {
  try {
    const { city, category } = req.query;
    let filter = {};
    if (city) filter.city = city;
    if (category) filter.categories = new RegExp(category, "i");

    const businesses = await Business.find(filter)
      .select("business_id name city stars review_count categories");

    res.json({
      total: businesses.length,
      businesses
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Análisis de demanda: top palabras clave en reseñas
exports.analyzeDemand = async (req, res) => {
  try {
    const { businessId } = req.query;
    const reviews = await Review.find({ business_id: businessId })
      .limit(50)
      .select("text");

    const wordCount = {};
    reviews.forEach(r => {
      r.text.split(/\s+/).forEach(w => {
        const word = w.toLowerCase().replace(/[^a-záéíóúñ]/gi, "");
        if (word.length > 3) wordCount[word] = (wordCount[word] || 0) + 1;
      });
    });

    const sorted = Object.entries(wordCount).sort((a, b) => b[1] - a[1]).slice(0, 15);
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Brechas: comparar #negocios vs #reseñas en ciudad
exports.analyzeGaps = async (req, res) => {
  try {
    const { city } = req.query;

    const businesses = await Business.find({ city }).select("business_id");
    const businessIds = businesses.map(b => b.business_id);

    const reviewCount = await Review.countDocuments({ business_id: { $in: businessIds } });

    res.json({
      city,
      totalBusinesses: businesses.length,
      totalReviews: reviewCount,
      ratio: businesses.length > 0 ? (reviewCount / businesses.length).toFixed(2) : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
