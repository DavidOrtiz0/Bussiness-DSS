/**
 * Modelo de Usuario
 * 
 * Representa a los usuarios de Yelp en la base de datos.
 * Incluye métricas de actividad como número de reseñas,
 * votos de "useful", "funny" y "cool", así como sus amistades.
 */

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    review_count: { type: Number, default: 0, min: 0 },
    yelping_since: { type: Date, required: true },
    useful: { type: Number, default: 0, min: 0 },
    funny: { type: Number, default: 0, min: 0 },
    cool: { type: Number, default: 0, min: 0 },
    elite: { type: String, default: null },
    friends: { type: mongoose.Schema.Types.Mixed, default: null } // puede ser lista o null
  },
  { collection: "user", timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
