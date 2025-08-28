/**
 * Controlador de usuarios
 * - Permite obtener información de un usuario por ID
 * - Permite listar los usuarios más activos (por cantidad de reseñas)
 */

const User = require("../models/user.model");

/**
 * Obtener detalle de usuario por ID
 * Solo devuelve campos relevantes para análisis, evitando cargar toda la info.
 */
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({ user_id: req.params.id })
      .select("user_id name review_count useful funny cool elite");

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (err) {
    next(err); // middleware de errores centralizado
  }
};

/**
 * Obtener los usuarios con más reseñas (Top activos)
 * Param: ?limit=5 (default 5)
 */
exports.getTopUsers = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    const users = await User.find({})
      .sort({ review_count: -1 })
      .limit(parseInt(limit, 10))
      .select("user_id name review_count");

    res.json(users);
  } catch (err) {
    next(err);
  }
};
