import fs from "fs";
import { exec } from "child_process";

export const printLabel = (req, res) => {
  const { name, company, price, code, no, printerName } = req.body;

  if (!printerName) {
    return res.status(400).json({
      success: false,
      message: "Printer Configuration is required",
    });
  }

  const zpl = generateLabelZPL({ name, company, price, code, no });

  fs.writeFileSync("label.zpl", zpl);

  // IMPORTANT: correct UNC format (NO extra quotes inside path)
  const command = `copy /b label.zpl "\\\\localhost\\${printerName}"`;

  console.log("Executing:", command);

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("Print Error:", err);
      return res.status(500).json({
        success: false,
        message: "Unable to Find Printer. Please ensure the printer is shared and installed.",
      });
    }

    console.log("Print Success:", stdout);

    return res.json({
      success: true,
      message: "Label sent to printer",
    });
  });
};

const generateLabelZPL = ({ name, company, price, code, no }) => {
  return `
^XA
^PW406
^LL203
^LH0,0

^CF0,20

^FO0,20
^FB406,1,0,C,0
^FD${company}^FS

^FO35,50
^BY3,3,80
^BCN,80,N,N,N
^FD${code}^FS

^FO0,140
^FB406,1,0,C,0
^A0N,15,15
^FD${code}^FS

^CF0,18

^FO6,170
^FB406,1,0,L,0
^FDRs. ${price}^FS

^FO0,170
^FB400,1,0,R,0
^FD${name}^FS

^PQ${no}
^XZ
`;
};

export const getPrinter = () => {
  return new Promise((resolve, reject) => {
    exec('powershell \"Get-Printer | Select-Object -ExpandProperty Name\"', (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }
      console.log("Raw printer output:", stdout);
      const printers = stdout
        .split("\n")
        .map(p => p.trim())
        .filter(p => p);

      resolve(printers);
    });
  });
};