/**
 * Controlador de Negocios
 * - Permite listar negocios con filtros
 * - Obtener detalle de negocio
 */

const Business = require("../models/business.model");

/**
 * Listar negocios (filtrados por ciudad y/o categoría)
 */
exports.getBusinesses = async (req, res, next) => {
  try {
    const { city, category, limit = 20 } = req.query;
    const filter = {};

    if (city) filter.city = city;
    if (category) filter.categories = new RegExp(category, "i");

    const businesses = await Business.find(filter)
      .limit(parseInt(limit, 10))
      .select("business_id name city state stars review_count categories");

    res.json(businesses);
  } catch (err) {
    next(err);
  }
};

/**
 * Obtener detalle de un negocio por su ID
 */
exports.getBusinessById = async (req, res, next) => {
  try {
    const business = await Business.findOne({ business_id: req.params.id });
    if (!business) {
      return res.status(404).json({ error: "Negocio no encontrado" });
    }
    res.json(business);
  } catch (err) {
    next(err);
  }
};
