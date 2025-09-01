/**
 * Controlador de Negocios
 * - Listar negocios con filtros
 * - Obtener detalle de negocio
 *
 * 🚀 Refactor:
 * Todas las consultas ahora pasan por `req.db.business`
 * que puede apuntar a la colección original o a temp_business
 * según el flag `?temp=true` en la request.
 */

/**
 * Listar negocios (filtrados por ciudad y/o categoría)
 * @route GET /api/business
 * @query {string} [city]      - Ciudad a filtrar
 * @query {string} [category]  - Categoría (regex)
 * @query {number} [limit=20]  - Límite de resultados
 * @query {boolean} [temp]     - Si true, consulta colecciones temporales
 */
exports.getBusinesses = async (req, res, next) => {
  try {
    const { city, category, limit = 20 } = req.query;
    const filter = {};

    if (city) filter.city = city;
    if (category) filter.categories = new RegExp(category, "i");

    const businesses = await req.db.business
      .find(filter)
      .limit(parseInt(limit, 10))
      .select("business_id name city state stars review_count categories");

    res.json(businesses);
  } catch (err) {
    next(err);
  }
};

/**
 * Obtener detalle de un negocio por su ID
 * @route GET /api/business/:id
 * @param {string} id - business_id del negocio
 * @query {boolean} [temp] - Si true, consulta colecciones temporales
 */
exports.getBusinessById = async (req, res, next) => {
  try {
    const business = await req.db.business.findOne({ business_id: req.params.id });

    if (!business) {
      return res.status(404).json({ error: "Negocio no encontrado" });
    }

    res.json(business);
  } catch (err) {
    next(err);
  }
};
