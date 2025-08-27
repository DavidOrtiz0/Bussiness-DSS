const Business = require("../models/business.model");

// Listar negocios con filtros (ciudad, categoría)
exports.getBusinesses = async (req, res) => {
  try {
    const { city, category, limit = 20 } = req.query;
    let filter = {};
    if (city) filter.city = city;
    if (category) filter.categories = new RegExp(category, "i");

    const businesses = await Business.find(filter)
      .limit(parseInt(limit))
      .select("business_id name city state stars review_count categories");
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Detalle de un negocio
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findOne({ business_id: req.params.id });
    if (!business) return res.status(404).json({ error: "No encontrado" });
    res.json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
