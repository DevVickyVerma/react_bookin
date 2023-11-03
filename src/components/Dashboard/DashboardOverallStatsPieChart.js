import React from "react";
import ReactApexChart from "react-apexcharts";

const DashboardOverallStatsPieChart = ({ data }) => {
  let labels = [];
  let formattedLabels = [];
  let consoleValues = [];

  if (data && typeof data === "object") {
    consoleValues = Object.values(data).map((value) =>
      parseFloat(value.replace(/'/g, ""))
    );

    labels = Object.keys(data).map(
      (key) => key.charAt(0).toUpperCase() + key.slice(1)
    );

    formattedLabels = Object.keys(data).map((key) =>
      key
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  }

  const options = {
    chart: {
      width: 100,
      type: "pie",
    },
    labels: formattedLabels,
    colors: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(154, 62, 251)"],
  };

  return (
    <div id="chart" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <div className="d-flex chart-items">
        {labels.map((label, index) => {
          const formattedLabel = label
            .replace(/_/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          return (
            <div style={{ margin: 0 }} className="label-color" key={index}>
              <div
                className="chart-color-radius"
                style={{
                  backgroundColor: options.colors[index], // Use the specified color
                }}
              />
              <h6 className="mx-1">{formattedLabel}</h6>
            </div>
          );
        })}
      </div>
      <ReactApexChart options={options} series={consoleValues} type="pie"
        width={"100%"}
      // height={"100%"}
      />
    </div>
  );
};

export default DashboardOverallStatsPieChart;
