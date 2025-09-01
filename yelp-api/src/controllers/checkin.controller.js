/**
 * Controlador de Checkins
 * - Devuelve el número de checkins registrados para un negocio
 *
 * 🚀 Refactor:
 * Se usa `req.db.checkin` (dinámico: real o temp) en lugar del modelo fijo.
 */

/**
 * Obtener número de checkins de un negocio
 * @route GET /api/checkin/business/:businessId
 * @param {string} businessId - ID del negocio
 * @query {boolean} [temp]    - Si true, consulta colecciones temporales
 */
exports.getCheckinCount = async (req, res, next) => {
  try {
    const checkin = await req.db.checkin.findOne({ business_id: req.params.businessId });

    if (!checkin) {
      return res.json({ business_id: req.params.businessId, count: 0 });
    }

    // El campo date es un string con fechas separadas por comas
    const dates = checkin.date ? checkin.date.split(",").map(d => d.trim()) : [];

    res.json({
      business_id: req.params.businessId,
      count: dates.length,
    });
  } catch (err) {
    next(err);
  }
};
