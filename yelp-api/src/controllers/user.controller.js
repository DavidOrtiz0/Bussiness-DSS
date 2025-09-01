/**
 * Controlador de Usuarios
 * -----------------------
 * - Obtener detalle de usuario por ID
 * - Listar los usuarios más activos (ranking por cantidad de reseñas)
 *
 * ✅ Compatible con datasetSelector:
 *    Si el cliente pasa ?temp=true → se consulta en colecciones temporales (temp_user)
 *    Si no, se consulta en colecciones reales (user)
 */

exports.getUserById = async (req, res, next) => {
  try {
    // Seleccionar modelo según datasetSelector (inyectado en req.db.user)
    const UserModel = req.db.user;

    const user = await UserModel.findOne({ user_id: req.params.id })
      .select("user_id name review_count useful funny cool elite");

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (err) {
    next(err); // delega al middleware centralizado de errores
  }
};

/**
 * Listar usuarios más activos (top N)
 * @query limit (default 5)
 */
exports.getTopUsers = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    const UserModel = req.db.user;

    const users = await UserModel.find({})
      .sort({ review_count: -1 })
      .limit(parseInt(limit, 10))
      .select("user_id name review_count");

    res.json(users);
  } catch (err) {
    next(err);
  }
};
