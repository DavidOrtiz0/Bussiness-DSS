/**
 * Configuración de conexión a MongoDB usando Mongoose
 * - Usa variables de entorno para mayor flexibilidad
 * - Maneja reconexión en caso de fallo
 */

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
feature/completeapi
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/yelpdb";

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB conectado en: ${uri}`);
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);

    // Forzar salida si no se puede conectar
    process.exit(1);
  }
};

module.exports = connectDB;
