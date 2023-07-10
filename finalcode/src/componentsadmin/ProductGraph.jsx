import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const ProductCategoryGraph = ({ products }) => {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const categoryCount = countProductCategories(products);
    setCategoryData(categoryCount);
    createGraph(categoryCount);
  }, [products]);

  const countProductCategories = (products) => {
    const countMap = new Map();
    products.forEach((product) => {
      const category = product.productcategory;
      countMap.set(category, (countMap.get(category) || 0) + 1);
    });

    // Convert countMap to an array of objects with category and count properties
    const categoryCount = Array.from(countMap, ([category, count]) => ({ category, count }));
    return categoryCount;
  };

  const createGraph = (categoryData) => {
    const canvas = document.getElementById('productCategoryGraph');
    const ctx = canvas.getContext('2d');
  
    // Check if a Chart instance already exists
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy(); // Destroy the existing Chart instance
    }
  
    // Create the new Chart instance
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: categoryData.map((data) => data.category),
        datasets: [
          {
            label: 'Product Count by Category',
            data: categoryData.map((data) => data.count),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  return (
    <div style={{ width: '450px', height: '400px' }}>
      <h2 style={{ fontSize:"20px", color:"black",marginTop:"20px",fontWeight:"bold"}}>Product Category Graph</h2>
      <canvas id="productCategoryGraph" style={{ width: '450px', height: '100%' }} />
    </div>
  );
};

export default ProductCategoryGraph;
