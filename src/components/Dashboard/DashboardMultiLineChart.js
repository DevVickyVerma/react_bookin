
import React from "react";
import { Line } from "react-chartjs-2";

const DashboardMultiLineChart = ({ LinechartValues, LinechartOption }) => {
  if (!LinechartValues || !LinechartOption) {
    // Data is not available yet, return a loading state or null
    return <p> Please Apply Filter To Visualize Chart.....</p>;
  }

  const labels = LinechartOption?.map((label) => label);


  const colorArray = [
    [255, 99, 132], // Red
    [54, 162, 235], // Green
    [154, 62, 251], // Blue
    // Add more colors as needed
  ];

  const datasets = LinechartValues?.map((dataset, index) => ({
    label: dataset?.name,
    data: dataset?.data,
    borderColor: `rgba(${colorArray[index % colorArray.length].join(", ")}, 1)`,
    backgroundColor: `rgba(${colorArray[index % colorArray.length].join(
      ", "
    )}, 0.2)`,

    yAxisID: index === 1 ? "y1" : "y",
    key: index,
  }));

  const data = {
    labels: labels,
    datasets: datasets,
  };

  const options = {
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        min: 0, // Set the minimum value to 0 for the left y-axis (y)
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        min: 0, // Set the minimum value to 0 for the left y-axis (y)
      },
    },
  };

  return (
    <div className="d-flex chart-items">
      <Line data={data} options={options} />
    </div>
  );
};

export default DashboardMultiLineChart;
