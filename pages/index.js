// pages/index.js
import { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { calculateCorrelation } from "../lib/utils";
import fetch from "isomorphic-unfetch";
import Button from "@/components/Button";

const Dashboard = () => {
  const chartId = "myChart";
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [correlation, setCorrelation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    const fetchData = async (filter) => {
      setIsLoading(true);

      try {
        const res = await fetch(`/api/chartData?filter=${filter}`);
        const data = await res.json();
        setChartData(data.chartData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData("");
  }, []);

  const handleFilterClick = async (filter) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/chartData?filter=${filter}`);
      const data = await res.json();
      setChartData(data.chartData);
      setActiveFilter(filter); // Set the active filter when data is successfully fetched
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
      const calculatedCorrelation = calculateCorrelation(
        stockData,
        sentimentData
      );
      setCorrelation(calculatedCorrelation);
    }
  }, [chartData]);

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <span className="font-bold"> Correlation: </span>
      <span>
        {correlation !== null ? correlation.toFixed(2) : "Calculating..."}
      </span>

      <br></br>
      <hr className="my-2"></hr>

      {/* Filter buttons */}
      <Button
        label="Last Month"
        isActive={activeFilter === "lastMonth"}
        onClick={() => handleFilterClick("lastMonth")}
      />
      <Button
        label="Last 3 Month"
        isActive={activeFilter === "last3Month"}
        onClick={() => handleFilterClick("last3Month")}
      />
      <Button
        label="Last Year"
        isActive={activeFilter === "lastYear"}
        onClick={() => handleFilterClick("lastYear")}
      />
      <Button
        label="All Data"
        isActive={activeFilter === ""}
        onClick={() => handleFilterClick("")}
      />

      {isLoading && <p>Loading...</p>}

      <canvas id={chartId} ref={chartRef} />
    </div>
  );
};

export default Dashboard;
