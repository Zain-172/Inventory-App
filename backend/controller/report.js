import PDFDocument from "pdfkit";

/**
 * Generate a dynamic PDF report
 * @param {Request} req - expects JSON body: { title, company, data: [{...}, ...] }
 * @param {Response} res
 */
export const generateReport = (req, res) => {
  try {
    const { title = "Report", company = "", data = [], total = [] } = req.body;
    console.log("Generating report with data:", data);
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "No data provided" });
    }

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=report.pdf");
    doc.pipe(res);

    const pageWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    doc.font("Helvetica-Bold");
    // ------------------ Title ------------------
    doc
      .fontSize(22)
      .fillColor("#333")
      .text(title, { align: "center", width: pageWidth })
      .moveDown(1);
    if (company) {
      doc
        .fontSize(14)
        .fillColor("#333")
        .text(company, { align: "center", width: pageWidth })
        .moveDown(2);
    }

    // ------------------ Table ------------------
    const tableHeaders = Object.keys(data[0]); // dynamic headers
    const colCount = tableHeaders.length;
    const colWidth = (pageWidth - 20) / (colCount - 1);
    const rowHeight = 25;
    let y = 170;

    // Draw headers
    doc
      .moveTo(doc.page.margins.left, y)
      .lineTo(doc.page.width - doc.page.margins.right, y)
      .stroke();
    y += rowHeight / 2;

    doc.fontSize(12).fillColor("black");
    let x = doc.page.margins.left;
    tableHeaders.forEach((header) => {
      doc.text(header, x, y, { width: header === "#" ? 20 : colWidth, align: "left" });
      x += header === "#" ? 20 : colWidth;
    });

    y += rowHeight / 2;
    doc
      .moveTo(doc.page.margins.left, y)
      .lineTo(doc.page.width - doc.page.margins.right, y)
      .stroke();
    y += rowHeight / 2;

    // Initialize totals for numeric columns
    const totals = {};

    // Draw rows
    doc.font("Helvetica");
    data.forEach((row) => {
      let x = doc.page.margins.left;

      // Page break check
      if (y + rowHeight > doc.page.height - doc.page.margins.bottom - 50) {
        doc.addPage();
        y = doc.page.margins.top;
      }

      tableHeaders.forEach((header) => {
        let cell = row[header] ?? "";
        console.log("Processing cell:", header, cell);
        // Fixed width 20 if cell is "#", else use normal column width
        let width = header === "#" ? 20 : colWidth;

        doc.text(cell.toString(), x, y, { width, align: "left" });
        x += width; // increment x by the actual width
      });

      // Draw row underline
      doc
        .moveTo(doc.page.margins.left, y + rowHeight - 5)
        .lineTo(doc.page.width - doc.page.margins.right, y + rowHeight - 5)
        .strokeColor("#ccc")
        .stroke();

      y += rowHeight;
    });

    // ------------------ Summary Row ------------------
    x = doc.page.margins.left;
    if (y + rowHeight > doc.page.height - doc.page.margins.bottom - 50) {
      doc.addPage();
      y = doc.page.margins.top;
    }

    if (total.length) {
      doc.font("Helvetica-Bold");
      let labelWidth = colWidth * (colCount - 1 - total.length) + 20;
      doc.text("Total:", x, y, { width: labelWidth - 20, align: "right" });
      x += labelWidth;

      // Total numeric columns
      total.forEach((totals) => {
        doc.text(totals, x, y, { width: colWidth, align: "left" });
        x += colWidth;
      });
    }
    doc
      .moveTo(doc.page.margins.left, y + rowHeight - 5)
      .lineTo(doc.page.width - doc.page.margins.right, y + rowHeight - 5)
      .strokeColor("#000")
      .stroke();

    // ------------------ Footer ------------------
    doc
      .fontSize(12)
      .fillColor("#666")
      .text(
        `${new Date().toLocaleString().split(",")[1]}`,
        doc.page.margins.left,
        doc.page.height - doc.page.margins.bottom - 20,
        { align: "right", width: pageWidth }
      )
      .moveDown(1);
    doc
      .fontSize(12)
      .fillColor("#666")
      .text(
        `${new Date().toLocaleString().split(",")[0]}`,
        doc.page.margins.left,
        doc.page.height - doc.page.margins.bottom - 20,
        { align: "left", width: pageWidth }
      )
      .moveDown(1);

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating PDF" });
  }
};
