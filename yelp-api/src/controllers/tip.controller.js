/**
 * Controlador de Tips
 * - Permite obtener tips asociados a un negocio
 *
 * ✅ Refactor:
 * Usa `req.db.tip` en lugar del modelo estático,
 * lo que permite alternar entre colecciones reales y temporales (?temp=true).
 */

 /**
  * Obtener tips de un negocio
  * @route GET /api/tip/business/:businessId?temp=true
  */
exports.getTipsByBusiness = async (req, res, next) => {
  try {
    const tips = await req.db.tip.find({ business_id: req.params.businessId })
      .select("text date compliment_count");

    res.json(tips);
  } catch (err) {
    next(err);
  }
};
