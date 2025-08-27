const Checkin = require("../models/checkin.model");

// Obtener número de checkins (útil para medir demanda)
exports.getCheckinCount = async (req, res) => {
  try {
    const checkin = await Checkin.findOne({ business_id: req.params.businessId });
    if (!checkin) return res.json({ count: 0 });

    // cada fecha está separada por comas en el campo date
    const dates = checkin.date ? checkin.date.split(",").map(d => d.trim()) : [];
    res.json({ business_id: req.params.businessId, count: dates.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
