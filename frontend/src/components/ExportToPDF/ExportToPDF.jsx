import './ExportToPDF.css';

const ExportToPDF = () => {
    const handleDownloadPDF = () => {
        print();
      };

    return (
        <button onClick={handleDownloadPDF}>Save Layout</button>
    )
}

export default ExportToPDF;