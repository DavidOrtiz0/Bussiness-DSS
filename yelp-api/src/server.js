/**
 * Punto de entrada principal de la aplicación
 *
 * - Conecta con la base de datos MongoDB.
 * - Inicia el servidor Express en el puerto configurado.
 * - Utiliza variables de entorno para facilitar la configuración.
 */

const app = require("./app");
const connectDB = require("./config/db");

// Puerto configurado desde variables de entorno o por defecto 4000
const PORT = process.env.PORT || 4000;

// Conexión a la base de datos
connectDB()
  .then(() => {
    // Levantar servidor solo si la DB se conecta correctamente
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error conectando a la base de datos:", err);
    process.exit(1); // Finaliza el proceso si falla la conexión
  });
