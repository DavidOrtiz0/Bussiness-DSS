/**
 * Controlador para carga de datasets
 * -----------------------------------
 * - Permite cargar archivos JSON o JSON Lines
 * - Valida estructura según la colección destino
 * - Almacena datos en colecciones temporales (prefijo: temp_)
 *
 * ⚠️ Nota:
 * Los datasets siempre se cargan en colecciones temporales.
 * Las colecciones originales permanecen intactas.
 */

const fs = require("fs");
const Business = require("../models/business.model");
const Review = require("../models/review.model");
const User = require("../models/user.model");
const Tip = require("../models/tip.model");
const Checkin = require("../models/checkin.model");

// Validadores Joi
const businessSchema = require("../validators/business.validator");
const reviewSchema = require("../validators/review.validator");
const userSchema = require("../validators/user.validator");
const tipSchema = require("../validators/tip.validator");
const checkinSchema = require("../validators/checkin.validator");

// Mapa dinámico colección → modelo y validador
const modelMap = {
  business: Business,
  review: Review,
  user: User,
  tip: Tip,
  checkin: Checkin
};

const validatorMap = {
  business: businessSchema,
  review: reviewSchema,
  user: userSchema,
  tip: tipSchema,
  checkin: checkinSchema
};

/**
 * Cargar dataset a colección temporal
 * @route POST /api/upload/:collection
 * @param {string} collection - Nombre de la colección (business, review, user, tip, checkin)
 */
exports.uploadDataset = async (req, res, next) => {
  try {
    const { collection } = req.params;

    // Validar colección soportada
    if (!modelMap[collection]) {
      return res.status(400).json({ error: "Colección no soportada" });
    }

    // Validar archivo subido
    if (!req.file) {
      return res.status(400).json({ error: "Debes subir un archivo JSON o JSON Lines" });
    }

    // Leer archivo cargado
    const rawData = fs.readFileSync(req.file.path, "utf8");
    let jsonData;

    try {
      // Intentar como JSON array
      jsonData = JSON.parse(rawData);
    } catch {
      // Si falla, parsear como JSON Lines
      jsonData = rawData
        .split("\n")
        .filter(line => line.trim() !== "")
        .map(line => JSON.parse(line));
    }

    // Validar cada documento con Joi
    const validator = validatorMap[collection];
    for (let i = 0; i < jsonData.length; i++) {
      const { error } = validator.validate(jsonData[i], { allowUnknown: true });
      if (error) {
        return res.status(400).json({
          error: `Error en documento ${i + 1}: ${error.message}`
        });
      }
    }

    // Guardar en colección temporal (temp_collection)
    const model = modelMap[collection];
    const tempCollection = model.collection.conn.collection(`temp_${collection}`);

    // Limpiar colección temporal antes de insertar
    await tempCollection.deleteMany({});
    await tempCollection.insertMany(jsonData);

    return res.json({
      message: `✅ Archivo cargado en temp_${collection}`,
      total: jsonData.length
    });
  } catch (err) {
    console.error("🔥 Upload error:", err);
    next(err);
  }
};
