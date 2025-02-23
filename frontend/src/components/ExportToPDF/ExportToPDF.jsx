import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf'

const ExportToPDF = () => {
    const contentRef = useRef(null);

    const handleDownloadPDF = () => {
        const input = contentRef.current;
    
        html2canvas(input, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          const imgWidth = 210; // A4 width in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
          pdf.save("exported_page.pdf");
        });
      };

    return (
        <button onClick={handleDownloadPDF}>Export to PDF</button>
    )
}

export default ExportToPDF;