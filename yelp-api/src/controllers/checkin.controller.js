/**
 * Controlador de Checkins
 * - Devuelve el número de checkins registrados para un negocio
 */

const Checkin = require("../models/checkin.model");

exports.getCheckinCount = async (req, res, next) => {
  try {
    const checkin = await Checkin.findOne({ business_id: req.params.businessId });
    if (!checkin) return res.json({ business_id: req.params.businessId, count: 0 });

    const dates = checkin.date ? checkin.date.split(",").map(d => d.trim()) : [];
    res.json({ business_id: req.params.businessId, count: dates.length });
  } catch (err) {
    next(err);
  }
};
