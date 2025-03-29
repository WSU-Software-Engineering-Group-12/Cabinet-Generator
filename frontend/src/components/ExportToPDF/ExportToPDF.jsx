const ExportToPDF = () => {
    const handleDownloadPDF = () => {
        print();
      };

    return (
        <button onClick={handleDownloadPDF}>Export to PDF</button>
    )
}

export default ExportToPDF;