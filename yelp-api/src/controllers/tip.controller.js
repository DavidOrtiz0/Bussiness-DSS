/**
 * Controlador de Tips
 * - Permite obtener tips asociados a un negocio
 */

const Tip = require("../models/tip.model");

exports.getTipsByBusiness = async (req, res, next) => {
  try {
    const tips = await Tip.find({ business_id: req.params.businessId })
      .select("text date compliment_count");

    res.json(tips);
  } catch (err) {
    next(err);
  }
};
