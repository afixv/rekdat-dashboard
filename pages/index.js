// pages/dashboard.js
import { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { getChartData } from "../lib/db";

export async function getServerSideProps() {
  const chartData = await getChartData();

  return {
    props: {
      chartData,
    },
  };
}

const Dashboard = ({ chartData }) => {
  const [timeScale, setTimeScale] = useState("daily");
  const chartId = "myChart";
  const chartRef = useRef(null);

  const handleTimeScaleChange = (newTimeScale) => {
    setTimeScale(newTimeScale);
  };

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
    }
  }, [chartData]);

  return (
    <div>
      <h1>Dashboard</h1>
      <select onChange={(e) => handleTimeScaleChange(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
      <canvas id={chartId} ref={chartRef} />
    </div>
  );
};

export default Dashboard;
