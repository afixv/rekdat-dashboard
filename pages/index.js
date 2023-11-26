import { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { getChartData } from "../lib/db";
import { calculateCorrelation } from "../lib/utils"; // Import the correlation calculation function

export async function getServerSideProps() {
  const chartData = await getChartData();

  return {
    props: {
      chartData,
    },
  };
}

const Dashboard = ({ chartData }) => {
  const chartId = "myChart";
  const chartRef = useRef(null);
  const [correlation, setCorrelation] = useState(null);

  useEffect(() => {
    console.log('chartData:', chartData);
    // Create or update the chart after the component mounts or data changes
    if (chartRef.current && chartData) {
      const ctx = chartRef.current.getContext("2d");

      // Check if there's an existing Chart instance and destroy it
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      // Create a new Chart instance
      chartRef.current.chart = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: {
          scales: {
            x: {
              type: "category",
            },
          },
        },
      });

      // Calculate and set the correlation
      const stockData = chartData.datasets[0].data;
      const sentimentData = chartData.datasets[1].data;
      const calculatedCorrelation = calculateCorrelation(stockData, sentimentData);
      setCorrelation(calculatedCorrelation);
    }
  }, [chartData]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Correlation: {correlation !== null ? correlation.toFixed(2) : 'Calculating...'}</p>
      <canvas id={chartId} ref={chartRef} />
    </div>
  );
};

export default Dashboard;
