import fs from "fs";
import { exec } from "child_process";

export const printLabel = (req, res) => {
  const { name, company, price, code, no } = req.body;
  const zpl = generateLabelZPL({ name, company, price, code, no });
  const printerName = "Microsoft Print to PDF"; // Change this to your actual printer name

  fs.writeFileSync("label.zpl", zpl);

  exec(`copy /b label.zpl \\\\localhost\\${printerName}`, (err) => {
    if (err) console.error(err);
  });
  res.json({ success: true });
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
  const printers = [];
  exec("powershell \"Get-Printer | Format-Table Name\"", (err, stdout) => {
    if (err) {
      console.error(err);
      return;
    }
    const lines = stdout.split("\n").slice(2); // Skip the first two lines
    lines.forEach((line) => {
      const printerName = line.trim();
      if (printerName) printers.push(printerName);
    });
  });

  return printers;
}