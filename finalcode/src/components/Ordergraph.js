import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { categorydata } from '../data/dummy';

const Histogram = ({ orders }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      // Destroy the previous chart instance
      chartInstanceRef.current.destroy();
    }

    // Group orders by category and calculate the total amount for each category
    const categoryAmounts = {};

    orders.forEach(order => {
      const category = order.productcategory;
      const amount = order.amount;

      if (categoryAmounts[category]) {
        categoryAmounts[category] += amount;
      } else {
        categoryAmounts[category] = amount;
      }
    });
    
    // Prepare the histogram data
    const labels = Object.keys(categoryAmounts).map(category => categorydata[category] || '');
    const data = Object.values(categoryAmounts);
    console.log(labels);
    // Create the histogram using Chart.js
    const ctx = chartRef.current.getContext('2d');
    const newChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Order Amount by Category',
          data: data,
          backgroundColor: 'rgba(0, 113, 156, 1)', // Darker color
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1, // Thinner border
          barThickness: 30, // Adjust the bar thickness as desired
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Category'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Amount'
            },
            ticks: {
              beginAtZero: true,
              precision: 0
            }
          }
        }
      }
    });

    // Store the chart instance for future reference
    chartInstanceRef.current = newChart;
  }, [orders]);

  return <canvas ref={chartRef} width={400} height={200}></canvas>;
};

export default Histogram;
