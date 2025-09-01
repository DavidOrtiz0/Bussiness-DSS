/**
 * Controlador de Exportación de Reportes
 * - Exporta en CSV o PDF
 * - Reportes soportados:
 *   - top-business
 *   - top-cities
 *   - top-users
 *   - categories
 *
 * 🚀 Refactor:
 * Se reemplaza el uso directo de modelos por `req.db`
 * para permitir consultas en colecciones reales o temporales.
 */

const PDFDocument = require("pdfkit");
const { Parser } = require("json2csv");

/**
 * Obtiene los datos de un reporte
 * @param {string} type - Tipo de reporte
 * @param {object} db   - Modelos dinámicos desde req.db
 */
async function getReportData(type, db) {
  switch (type) {
    case "top-business":
      return await db.business.find()
        .sort({ stars: -1, review_count: -1 })
        .limit(10)
        .select("name city stars review_count")
        .lean();

    case "top-cities":
      return await db.business.aggregate([
        { $group: { _id: "$city", total: { $sum: 1 } } },
        { $sort: { total: -1 } },
        { $limit: 10 }
      ]);

    case "top-users":
      return await db.user.find()
        .sort({ review_count: -1 })
        .limit(10)
        .select("name review_count useful cool funny")
        .lean();

    case "categories":
      return await db.business.aggregate([
        {
          $project: {
            categories: { $split: ["$categories", ", "] }
          }
        },
        { $unwind: "$categories" },
        { $group: { _id: "$categories", total: { $sum: 1 } } },
        { $sort: { total: -1 } },
        { $limit: 10 }
      ]);

    default:
      throw new Error("Reporte no soportado");
  }
}

/**
 * Exportar CSV
 * @route GET /api/export/csv?report=top-business&temp=true
 */
exports.exportCSV = async (req, res, next) => {
  try {
    const { report } = req.query;
    if (!report) {
      return res.status(400).json({ error: "Falta parámetro ?report=" });
    }

    const data = await getReportData(report, req.db);

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment(`${report}.csv`);
    res.send(csv);
  } catch (err) {
    console.error("CSV export error:", err);
    next(err);
  }
};

/**
 * Exportar PDF
 * @route GET /api/export/pdf?report=top-business&temp=true
 */
exports.exportPDF = async (req, res, next) => {
  try {
    const { report } = req.query;
    if (!report) {
      return res.status(400).json({ error: "Falta parámetro ?report=" });
    }

    const data = await getReportData(report, req.db);

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${report}.pdf`);

    doc.pipe(res);
    doc.fontSize(18).text(`Reporte: ${report}`, { align: "center" });
    doc.moveDown();

    data.forEach((item, i) => {
      doc.fontSize(12).text(`${i + 1}. ${JSON.stringify(item)}`);
    });

    doc.end();
  } catch (err) {
    console.error("PDF export error:", err);
    next(err);
  }
};
