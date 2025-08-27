const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  name: String,
  review_count: { type: Number, default: 0 },
  yelping_since: { type: Date },
  useful: { type: Number, default: 0 },
  funny: { type: Number, default: 0 },
  cool: { type: Number, default: 0 },
  elite: String,
  friends: { type: mongoose.Schema.Types.Mixed } // puede ser lista o null
}, { collection: "user" });

module.exports = mongoose.model("User", UserSchema);
