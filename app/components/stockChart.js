"use client";
import { useRef, useEffect, useState } from "react";
import { createChart } from "lightweight-charts";

export default function StockChart({ symbol }) {
  // Call the code to get the price data of all

  const [range, setRange] = useState();
  const [interval, setInterval] = useState();
  const [response, setResponse] = useState({});
  const [chartData, setChartData] = useState([{ time: 0, value: 0 }]);

  async function convertData(timestamps, equity) {
    const data = timestamps.map((timestamp, index) => {
  
      return { time: timestamp, value: equity[index] };
    });
    return data.filter(item => item.time !== null); // Filter out invalid data points
  }

  useEffect(() => {
    async function getStockHistory() {
      fetch(
        "/api/chart?symbol=" + symbol + "&range=" + "1d" + "&interval=" + "1m", {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then(async (response) => {
        const data = await response.json();
        console.log("Data from API:", data);
        setResponse(data);
        if (data.data && data.data.timestamps && data.data.closes) {
          setChartData(await convertData(data.data.timestamps, data.data.closes));
        } else {
          console.error("Unexpected data structure:", data);
        }
      });
    }
    getStockHistory();
  }, []);

  const chartContainerRef = useRef();

  // Creation and destruction of the chart instance
  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: 500,
      height: 100,
    });

    const newSeries = chart.addAreaSeries({
      topColor: "rgba(33, 150, 243, 0.56)",
      bottomColor: "rgba(33, 150, 243, 0.04)",
      lineColor: "rgba(33, 150, 243, 1)",
    });
    console.log('chartData before setData:', chartData);
    newSeries.setData(chartData);

    return () => [chart.remove()];
  }, [chartData]);

  return (
    <>
      <div ref={chartContainerRef}>Chart</div>
      <div></div>
    </>
  );
}
