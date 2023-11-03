import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const CompetitorSingleGraph = ({
  getCompetitorsPrice,
  setGetCompetitorsPrice,
}) => {
  // Now you can safely map over the data

  const [selectedFuelIndex, setSelectedFuelIndex] = useState(0);
  const selectedFuelType = getCompetitorsPrice?.fuelTypes[selectedFuelIndex];

  useEffect(() => {
    if (!getCompetitorsPrice) {
      return;
    }
  });


  // Filter the data for the selected fuel type
  const filteredData = getCompetitorsPrice?.dates?.map((date) => ({
    date,
    price: getCompetitorsPrice?.dataArray?.[date]?.[selectedFuelType],
  }));

  const colorArray = [
    [255, 99, 132], // Red
    [54, 162, 235], // Green
    [154, 62, 251], // Blue
    [255, 206, 86], // Yellow
    [75, 192, 192], // Teal
    [153, 102, 255], // Purple
    [255, 159, 64], // Orange
    [255, 77, 166], // Pink
    [24, 220, 255], // Aqua
    [255, 51, 51], // Crimson
    [0, 204, 102], // Green
    // Add more colors as needed
  ];

  const transformData = (data) => {
    const transformedData = {};

    for (const item of data || []) {
      if (item) {
        for (const priceItem of item?.price || []) {
          const { name, price } = priceItem;

          if (!transformedData[name]) {
            transformedData[name] = [];
          }

          transformedData[name].push(price);
        }
      }
    }
    return transformedData;
  };

  const transformedData = transformData(filteredData);

  const datasets = Object?.keys(transformedData).map((name, index) => ({
    label: name ? name : "",
    data: transformedData[name] ? transformedData[name] : "",
    borderColor: `rgba(${colorArray[index % colorArray.length].join(", ")}, 1)`,
    backgroundColor: `rgba(${colorArray[index % colorArray.length].join(
      ", "
    )}, 0.9)`,

    yAxisID: "y", // You can adjust the yAxisID as needed
    // type: name === getCompetitorsPrice?.siteName ? "bar" : "line",
    type: "bar",
  }));

  const data = {
    labels: filteredData
      ? filteredData?.map((selectedDate) => selectedDate.date)
      : "",
    datasets: datasets ? datasets : "",
  };

  const options = {
    // responsive: true,
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
        max: 3,
        ticks: {
          stepSize: 0.100, // Set the step size to 0.2
        },
      },
    },
  };

  const handleChange = (event) => {
    setSelectedFuelIndex(event.target.value); // Update the selected index
  };
  // if (!filteredData) {
  //   return "filter is not applied yet";
  // }
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!filteredData ? <span className="primary-loader"></span> : null}
      </div>

      <>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ display: "flex", width: "200px", margin: "10px 0" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Fuel Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedFuelIndex} // Use selectedFuelIndex as the selected value
                label="Fuel Type"
                onChange={handleChange}
              >
                {getCompetitorsPrice?.fuelTypes?.map((fuelType, index) => (
                  <MenuItem key={index} value={index}>
                    {fuelType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div>
          <Line data={data} options={options} />
        </div>
      </>
    </>
  );
};

export default CompetitorSingleGraph;
