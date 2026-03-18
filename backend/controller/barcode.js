import fs from "fs";
import { exec } from "child_process";

export const printLabel = (req, res) => {
  const { name, company, price, code } = req.body;
  const zpl = generateLabelZPL({ name, company, price, code });
  const printerName = "Your_Printer_Name"; // Change this to your actual printer name

  fs.writeFileSync("label.zpl", zpl);

  exec(`copy /b label.zpl \\\\localhost\\${printerName}`, (err) => {
    if (err) console.error(err);
  });
  res.json({ success: true });
};

const generateLabelZPL = ({ name, company, price, code }) => {
  return `
^XA
^PW600
^LH0,0

^CF0,25

^FO40,20
^FB520,1,0,C,0
^FD${company}^FS

^FO40,60
^BY2
^BCN,80,Y,N,N
^FD${code}^FS

^FO40,150
^FB260,1,0,L,0
^FDRs. ${price}^FS

^FO300,150
^FB260,1,0,R,0
^FD${name}^FS

^XZ
`;
};