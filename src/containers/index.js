import { PDFDocument } from "pdf-lib";

const createTestPdf = async () => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  page.drawText("Hello, world!", { x: 100, y: 300 });

  const pdfBytes = await pdfDoc.save();

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "test.pdf";
  link.click();
};

createTestPdf();
