const mongoose = require("mongoose");
const UserSchema = require("./user.model").schema;

module.exports = mongoose.model("TempUser", UserSchema, "temp_user");
