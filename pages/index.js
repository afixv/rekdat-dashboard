import { useState, useEffect, useRef } from "react";
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

  const categorizeCorrelationLevel = (correlation) => {
    if (correlation >= 0.8 || correlation <= -0.8) {
      return { label: "Very high", colorClass: "text-blue-700" };
    } else if (correlation >= 0.6 || correlation <= -0.6) {
      return { label: "High", colorClass: "text-blue-500" };
    } else if (correlation >= 0.4 || correlation <= -0.4) {
      return { label: "Moderate", colorClass: "text-yellow-500" };
    } else if (correlation >= 0.2 || correlation <= -0.2) {
      return { label: "Low", colorClass: "text-red-500" };
    } else {
      return { label: "Very low", colorClass: "text-red-700" };
    }
  };

  const correlationInfo =
    correlation !== null ? categorizeCorrelationLevel(correlation) : null;

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard TSLA Stock</h1>
      <p>
        Dashboard untuk Tugas Rekayasa Data, menampilkan grafik stock data dan
        average sentimen news untuk saham TSLA.
      </p>
      <span className="font-bold"> Correlation: </span>
      <span className={correlationInfo ? correlationInfo.colorClass : ""}>
        {correlation !== null ? correlation.toFixed(2) : "Calculating..."} (
        {correlationInfo ? correlationInfo.label : ""})
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

      {isLoading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="ml-2">Loading...</p>
        </div>
      )}

      <canvas id={chartId} ref={chartRef} />
    </div>
  );
};

export default Dashboard;
