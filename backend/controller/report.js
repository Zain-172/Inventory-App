import PDFDocument from "pdfkit";

const DATE_KEYS = ["date", "Date", "attendance_date", "Attendance Date"];
const EMPLOYEE_KEYS = [
  "employee",
  "Employee",
  "employee_name",
  "Employee Name",
  "name",
  "Name",
];
const STATUS_KEYS = ["status", "Status", "attendance", "Attendance"];

const firstValueByKeys = (row, keys) => {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null) {
      return row[key];
    }
  }
  return "";
};

const formatDateHeader = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value ?? "");
  }
  return date.toISOString().split("T")[0];
};

const drawReportFooter = (doc, pageWidth) => {
  doc
    .fontSize(12)
    .fillColor("#666")
    .text(
      `${new Date().toLocaleString().split(",")[1]}`,
      doc.page.margins.left,
      doc.page.height - doc.page.margins.bottom - 20,
      { align: "right", width: pageWidth }
    );

  doc
    .fontSize(12)
    .fillColor("#666")
    .text(
      `${new Date().toISOString().split("T")[0]}`,
      doc.page.margins.left,
      doc.page.height - doc.page.margins.bottom - 20,
      { align: "left", width: pageWidth }
    );
};

export const generateAttendenceReport = (req, res) => {
  try {
    const { title = "Attendance Report", company = "", data = [] } = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "No attendance data provided" });
    }

    const dates = [
      ...new Set(
        data
          .map((row) => formatDateHeader(firstValueByKeys(row, DATE_KEYS)))
          .filter(Boolean)
      ),
    ];

    const employees = [
      ...new Set(
        data
          .map((row) => String(firstValueByKeys(row, EMPLOYEE_KEYS)).trim())
          .filter(Boolean)
      ),
    ];

    if (!dates.length || !employees.length) {
      return res.status(400).json({
        message:
          "Attendance report needs date and employee fields in each data row",
      });
    }

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=attendence-report.pdf");
    doc.pipe(res);

    const pageWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const left = doc.page.margins.left;
    const right = doc.page.width - doc.page.margins.right;

    doc
      .font("Helvetica-Bold")
      .fontSize(22)
      .fillColor("#333")
      .text(title, { align: "center", width: pageWidth })
      .moveDown(1);

    if (company) {
      doc
        .fontSize(14)
        .fillColor("#333")
        .text(company, { align: "center", width: pageWidth })
        .moveDown(1.5);
    }

    const matrix = {};
    employees.forEach((employee) => {
      matrix[employee] = {};
    });

    data.forEach((row) => {
      const employee = String(firstValueByKeys(row, EMPLOYEE_KEYS)).trim();
      const date = formatDateHeader(firstValueByKeys(row, DATE_KEYS));
      const status = String(firstValueByKeys(row, STATUS_KEYS) || "-").trim();

      if (!employee || !date) {
        return;
      }

      matrix[employee][date] = status;
    });

    const headerHeight = 26;
    const rowHeight = 22;
    const employeeColWidth = Math.max(140, Math.min(200, pageWidth * 0.28));
    const dateColWidth = (pageWidth - employeeColWidth) / dates.length;
    const tableBottomLimit = doc.page.height - doc.page.margins.bottom - 45;
    let y = 150;

    const drawHeader = () => {
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#111")
        .rect(left, y, employeeColWidth, headerHeight)
        .strokeColor("#222")
        .stroke();

      doc.text("Employee Name", left + 6, y + 8, {
        width: employeeColWidth - 12,
        align: "left",
      });

      let x = left + employeeColWidth;
      dates.forEach((date) => {
        doc.rect(x, y, dateColWidth, headerHeight).strokeColor("#222").stroke();
        doc.text(date, x + 4, y + 8, {
          width: dateColWidth - 8,
          align: "center",
        });
        x += dateColWidth;
      });

      y += headerHeight;
    };

    drawHeader();
    doc.font("Helvetica").fontSize(10).fillColor("#222");

    employees.forEach((employee, index) => {
      if (y + rowHeight > tableBottomLimit) {
        doc.addPage();
        y = doc.page.margins.top + 10;
        drawHeader();
        doc.font("Helvetica").fontSize(10).fillColor("#222");
      }

      const rowFill = index % 2 === 0 ? "#fafafa" : "#fff";
      doc.rect(left, y, right - left, rowHeight).fill(rowFill).strokeColor("#ddd").stroke();

      doc.fillColor("#111").text(employee, left + 6, y + 7, {
        width: employeeColWidth - 12,
        align: "left",
      });

      let x = left + employeeColWidth;
      dates.forEach((date) => {
        const value = matrix[employee][date] || "-";
        doc.rect(x, y, dateColWidth, rowHeight).strokeColor("#ddd").stroke();
        doc.fillColor("#222").text(value, x + 4, y + 7, {
          width: dateColWidth - 8,
          align: "center",
        });
        x += dateColWidth;
      });

      y += rowHeight;
    });

    drawReportFooter(doc, pageWidth);
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating attendance PDF" });
  }
};

/**
 * Generate a dynamic PDF report
 * @param {Request} req - expects JSON body: { title, company, data: [{...}, ...] }
 * @param {Response} res
 */
export const generateReport = (req, res) => {
  try {
    const { title = "Report", company = "", data = [], total = [] } = req.body;
    if (/attend(e|a)nce/i.test(title)) {
      return generateAttendenceReport(req, res);
    }
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
    const colWidth = tableHeaders[0] === "#" ? (pageWidth - 20) / (colCount - 1) : pageWidth / colCount;
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
      let labelWidth = tableHeaders[0] === "#" ? colWidth * (colCount - 1 - total.length) + 20 : colWidth * (colCount - total.length);
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
    drawReportFooter(doc, pageWidth);

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating PDF" });
  }
};

