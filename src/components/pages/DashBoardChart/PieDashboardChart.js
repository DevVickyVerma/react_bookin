import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const Apexcharts2 = ({ data }) => {
  const [series, setSeries] = useState([10, 15, 33, 43]);



  let labels = [];
  let formattedLabellabels = [];
  let consolevalues = [];
  if (data && typeof data === "object") {
    consolevalues = Object.values(data).map((value) =>
      parseFloat(value.replace(/'/g, ""))
    );

    labels = Object.keys(data).map(
      (key) => key.charAt(0).toUpperCase() + key.slice(1)
    );



    // Update the labels array with the capitalized keyslabels.map((label, index) => {
    formattedLabellabels = Object.keys(data)
      .map((key) =>
        key
          .replace(/_/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      );



  }

  const options = {
    chart: {
      width: "100%",
      type: "pie",
    },
    labels: formattedLabellabels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 380,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    colors: ["#e1af3b", "#25e4a0", "#26a0fc",], // Example colors for each series
    // colors: ["#26a0fc", "#febc3b", "#26a0fc", "#6699ff"], // Example colors for each series
  };

  const realColors = options.colors.map((color) => {
    return color.startsWith("#") ? color : "#" + color;
  });


  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={consolevalues}
        type="pie"
        width={380}
      />
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
                  backgroundColor: realColors[index],
                }}
              />
              <h6 className="mx-1">{formattedLabel}</h6>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Apexcharts2;
