import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Tooltip from "@mui/material/Tooltip";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

const TrendDashboard = () => {
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTrendData();
      const sortedData = data.sort(
        (a, b) => b.scores.slice(-1)[0] - a.scores.slice(-1)[0]
      );
      setTrendData(sortedData);
    };
    fetchData();
  }, []);

  if (trendData.length === 0) return null;

  const timeSeriesData = {
    labels: trendData[0].timestamps,
    datasets: trendData.map((trend, index) => ({
      label: trend.label,
      data: trend.scores,
      borderColor: colors[index % colors.length],
      fill: false,
    })),
  };

  return (
    <div className="p-5">
      <div className="flex justify-around items-center border p-4 rounded-lg mb-6">
        {trendData.map((trend, index) => (
          <Tooltip key={trend.label} title={trend.description} arrow>
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium">{trend.label}</span>
              <span
                className="inline-block h-8 w-8 rounded-full text-center leading-8"
                style={{
                  backgroundColor: colors[index % colors.length],
                  color: "white",
                }}
              >
                {trend.scores[trend.scores.length - 1]}
              </span>
            </div>
          </Tooltip>
        ))}
      </div>

      <div style={{ height: "400px" }}>
        <Line
          data={{
            labels: trendData[0].timestamps,
            datasets: trendData.map((trend, index) => ({
              label: trend.label,
              data: trend.scores,
              borderColor: colors[index % colors.length],
              fill: false,
            })),
          }}
          options={{
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: false,
                  text: "Score",
                },
              },
              x: {
                title: {
                  display: false,
                  text: "Month",
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

// Dummy API Fetch function
async function fetchTrendData() {
  return Promise.resolve([
    {
      label: "React",
      scores: [65, 59, 80, 81, 56],
      timestamps: ["January", "February", "March", "April", "May"],
      description: "A JavaScript library for building user interfaces.",
    },
    {
      label: "Vue",
      scores: [28, 48, 40, 19, 86],
      timestamps: ["January", "February", "March", "April", "May"],
      description: "The Progressive JavaScript Framework.",
    },
    {
      label: "Angular",
      scores: [55, 25, 50, 30, 70],
      timestamps: ["January", "February", "March", "April", "May"],
      description:
        "A platform for building mobile and desktop web applications.",
    },
    {
      label: "Svelte",
      scores: [38, 85, 55, 23, 60],
      timestamps: ["January", "February", "March", "April", "May"],
      description: "Cybernetically enhanced web apps.",
    },
    {
      label: "Next.js",
      scores: [50, 45, 30, 65, 95],
      timestamps: ["January", "February", "March", "April", "May"],
      description: "The React Framework for Production.",
    },
  ]);
}

export default TrendDashboard;
