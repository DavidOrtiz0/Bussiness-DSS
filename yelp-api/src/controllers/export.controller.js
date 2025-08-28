const PDFDocument = require("pdfkit");
const { Parser } = require("json2csv");
const Business = require("../models/business.model");
const User = require("../models/user.model");
const Review = require("../models/review.model");

async function getReportData(type) {
  switch (type) {
    case "top-business":
      return await Business.find()
        .sort({ stars: -1, review_count: -1 })
        .limit(10)
        .select("name city stars review_count")
        .lean();

    case "top-cities":
      return await Business.aggregate([
        { $group: { _id: "$city", total: { $sum: 1 } } },
        { $sort: { total: -1 } },
        { $limit: 10 }
      ]);

    case "top-users":
      return await User.find()
        .sort({ review_count: -1 })
        .limit(10)
        .select("name review_count useful cool funny")
        .lean();

    case "categories":
      return await Business.aggregate([
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

// CSV export
exports.exportCSV = async (req, res) => {
  try {
    const { report } = req.query;
    if (!report) return res.status(400).json({ error: "Falta parámetro ?report=" });

    const data = await getReportData(report);
    const parser = new Parser();
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment(`${report}.csv`);
    res.send(csv);
  } catch (err) {
    console.error("CSV export error:", err);
    res.status(500).json({ error: "Error exportando CSV" });
  }
};

// PDF export
exports.exportPDF = async (req, res) => {
  try {
    const { report } = req.query;
    if (!report) return res.status(400).json({ error: "Falta parámetro ?report=" });

    const data = await getReportData(report);
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
    res.status(500).json({ error: "Error exportando PDF" });
  }
};
