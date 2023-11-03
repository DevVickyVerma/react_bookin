import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";  // its very impotent to import this auto chart 

const StackedLineBarChart = ({ stackedLineBarLabels, stackedLineBarData }) => {
  if (!stackedLineBarLabels || !stackedLineBarData) {
    // Data is not available yet, return a loading state or null
    return <p> Please Apply Filter To Visualize Charttt.....</p>;
  }

  const datasets = stackedLineBarData?.map((dataset, index) => {
    return {
      label: dataset?.label,
      data: dataset?.data,
      borderColor: dataset?.borderColor,
      backgroundColor: dataset?.backgroundColor,
      yAxisID: dataset?.yAxisID,
      type: index === 1 ? "line" : "bar", // import Chart from "chart.js/auto"; 
      key: index,
    };
  });


  const data = {
    labels: stackedLineBarLabels ? stackedLineBarLabels : [],
    datasets: datasets,
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
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
    plugins: {
      legend: {
        position: "top", // Adjust the legend position as needed
      },
    },
    elements: {
      bar: {
        order: "stacked", // Ensure proper stacking of bars
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default StackedLineBarChart;
