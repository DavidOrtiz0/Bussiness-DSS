const Tip = require("../models/tip.model");

// Tips de un negocio
exports.getTipsByBusiness = async (req, res) => {
  try {
    const tips = await Tip.find({ business_id: req.params.businessId })
      .select("text date compliment_count");
    res.json(tips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
