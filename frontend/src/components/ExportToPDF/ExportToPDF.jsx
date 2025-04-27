import './ExportToPDF.css';

// TODO: Handle scaling better, might need to make a full new printing page
const ExportToPDF = () => {
    const handleDownloadPDF = () => {
        print();
      };

    return (
        <button onClick={handleDownloadPDF}>Save Layout</button>
    )
}

export default ExportToPDF;