import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ExcelDownloadButton from './ExcelDownloadButton';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
};

const BarChart = ({ apiUrl }) => {
  const [data, setData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const result = await response.json();

        // Check if the API response contains data
        if (!result.data || result.data.length === 0) {
          setError('No data available.');
        } else {
            // Extracting the necessary data from the API response
            const labels = result.data.map(entry => entry.Month);
            const dataset1Data = result.data.map(entry => entry.primaryProduct);
            const dataset2Data = result.data.map(entry => entry.secondaryProduct);

            // Update the state with the fetched data
            setData({
              labels: labels,
              datasets: [
                {
                  label: 'Primary Product',
                  data: dataset1Data,
                  backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                  label: 'Secondary Product',
                  data: dataset2Data,
                  backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
              ],
            });
        }
      } catch (error) {
        setError(error.message);
      }
      finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);


  return (
    <div id="chart">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <>
          <ExcelDownloadButton apiUrl={apiUrl} />
          <Bar ref={chartRef} options={options} data={data} />        
        </>
      )}
    </div>
  );
};

export default BarChart;
