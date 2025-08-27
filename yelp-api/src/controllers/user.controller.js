const User = require("../models/user.model");

// Detalle usuario sin cargar todo
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.id })
      .select("user_id name review_count useful funny cool elite");
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Top usuarios activos (para análisis de reseñas)
exports.getTopUsers = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const users = await User.find({})
      .sort({ review_count: -1 })
      .limit(parseInt(limit))
      .select("user_id name review_count");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
