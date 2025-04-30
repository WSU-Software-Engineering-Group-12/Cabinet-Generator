import './ExportToPDF.css';  // Import CSS styles specific to the ExportToPDF component

/**
 * @summary ExportToPDF component that triggers a PDF download.
 * 
 * This component renders a button that, when clicked, triggers the print dialog
 * for saving the layout as a PDF.
 */
const ExportToPDF = () => {

    // Function that triggers the print dialog
    const handleDownloadPDF = () => {
        print();  // Invoke the browser's print dialog, which includes the option to save as PDF
    };

    return (
        // Button that triggers the handleDownloadPDF function when clicked
        <button onClick={handleDownloadPDF}>Save Layout</button>
    );
}

// Export the ExportToPDF component for use in other parts of the app
export default ExportToPDF;
