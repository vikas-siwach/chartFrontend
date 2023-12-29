import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const ExcelDownloadButton = ({apiUrl}) => {
  const [apiData, setApiData] = useState([]);

  const fetchDataFromApi = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setApiData(data);
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };

  const downloadPdfDocument = () => {
    const input = document.getElementById('chart');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'JPEG', 0, 0);
      pdf.save(`chart.pdf`);
    });
  };

  const handleDownload = () => {
    console.log('apiData', apiData.data);
    const dataToExport = apiData.data.map(({ Month, primaryProduct, secondaryProduct }) => ({
      Month,
      primaryProduct,
      secondaryProduct,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Convert the workbook to a binary Excel file and trigger download
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'apiData.xlsx');
  };

  useEffect(() => {
    // Trigger download when apiData is updated
    if (apiData.data) {
      handleDownload();
    }
  }, [apiData]);

  return (
    <div>
      <button onClick={fetchDataFromApi}>Fetch Data and Download Excel</button>
      <button onClick={downloadPdfDocument}>Download as PDF</button>
    </div>
  );
};

export default ExcelDownloadButton;
