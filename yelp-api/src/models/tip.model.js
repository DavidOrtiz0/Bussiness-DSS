/**
 * Modelo de Tip
 * 
 * Los tips son consejos o comentarios cortos dejados por usuarios
 * en un negocio específico. Diferentes a las reseñas porque suelen
 * ser más breves y directos.
 */

const mongoose = require("mongoose");

const TipSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, index: true },
    business_id: { type: String, required: true, index: true },
    text: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
    compliment_count: { type: Number, default: 0, min: 0 }
  },
  { collection: "tip", timestamps: true }
);

module.exports = mongoose.model("Tip", TipSchema);
