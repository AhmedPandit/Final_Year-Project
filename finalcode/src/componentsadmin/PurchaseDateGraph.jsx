import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import { enUS } from 'date-fns/locale';
import 'chartjs-adapter-moment';

const PurchaseDateGraph = ({ purchases }) => {
  const [purchaseData, setPurchaseData] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const data = preparePurchaseData(purchases);
    setPurchaseData(data);
    createGraph(data);
  }, [purchases]);

  const preparePurchaseData = (purchases) => {
    const purchaseCounts = new Map();
    purchases.forEach((purchase) => {
      const purchaseDate = purchase.buyerpurchasedata;
      const count = purchaseCounts.get(purchaseDate) || 0;
      purchaseCounts.set(purchaseDate, count + 1);
    });

    const sortedData = Array.from(purchaseCounts).sort((a, b) => {
      const dateA = new Date(a[0]);
      const dateB = new Date(b[0]);
      return dateA - dateB;
    });

    const formattedData = sortedData.map(([purchaseDate, count]) => ({
      purchaseDate,
      count,
    }));

    return formattedData;
  };

  const createGraph = (purchaseData) => {
    const canvas = canvasRef.current;

    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: purchaseData.map((data) => data.purchaseDate),
        datasets: [
          {
            label: 'Purchase Count by Date',
            data: purchaseData.map((data) => data.count),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                day: 'YYYY-MM-DD',
              },
            },
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  return (
    <div style={{ width: '80%', height: '350px' ,marginLeft:"10px"}}>
      <h2 style={{ fontSize:"20px", color:"black",marginTop:"20px",fontWeight:"bold"}}>Buyer Purchase Date Graph</h2>
      {purchases.length ? (
        <canvas ref={canvasRef} style={{ width: '100%', height: '350px' }} />
      ) : (
        <p>No sales data available.</p>
      )}
    </div>
  );
};

export default PurchaseDateGraph;
