/**
 * Controlador de Análisis DSS
 * - Análisis de ubicación
 * - Análisis de demanda
 * - Análisis de brechas oferta-demanda
 */

const Business = require("../models/business.model");
const Review = require("../models/review.model");

/**
 * Analiza negocios en una ciudad y categoría específica
 */
exports.analyzeLocation = async (req, res, next) => {
  try {
    const { city, category } = req.query;
    const filter = {};

    if (city) filter.city = city;
    if (category) filter.categories = new RegExp(category, "i");

    const businesses = await Business.find(filter)
      .select("business_id name city stars review_count categories");

    res.json({ total: businesses.length, businesses });
  } catch (err) {
    next(err);
  }
};

/**
 * Analiza demanda de un negocio en base a palabras clave en reseñas
 */
exports.analyzeDemand = async (req, res, next) => {
  try {
    const { businessId } = req.query;
    if (!businessId) {
      return res.status(400).json({ error: "Debe proporcionar un businessId" });
    }

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

    const sorted = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);

    res.json(sorted);
  } catch (err) {
    next(err);
  }
};

/**
 * Analiza brechas oferta-demanda en una ciudad
 */
exports.analyzeGaps = async (req, res, next) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ error: "Debe proporcionar una ciudad" });
    }

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
    next(err);
  }
};
