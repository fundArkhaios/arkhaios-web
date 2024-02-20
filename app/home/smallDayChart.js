import useFetch from "../hooks/useFetch";
import { useState, useRef, useEffect } from "react";
import {
  ColorType,
  createChart,
  CrosshairMode,
  LineStyle,
} from "lightweight-charts";

export default function SmallDayChart({symbol}) {
  const miniChartContainerRef = useRef();

  const { responseJSON, isLoading, error } = useFetch(
    "/api/chart?symbol=" + symbol + "&range=1d&interval=15m"
  );

  const [processedData, setProcessedData] = useState([ {time: 0, value: 0}]);

  useEffect(() => {
    console.log("Symbol: " + symbol);
    console.log("Error: " + error);
    console.log("HELLO");
    // This function will process the responseJSON data
    function processData(data) {
      let result = [];
      for (let i = 0; i < data.timestamps.length; i++) {
        result.push({
          time: data.timestamps[i] * 1000,
          value: data.closes[i],
        });
      }
      return result;
    }
    console.log("ResponseJSON: " + JSON.stringify(responseJSON));
    console.log("isLoading: " + isLoading);
    // Make sure responseJSON is not null and the promise has been resolved
    if (responseJSON && !isLoading && responseJSON.status != "error") {
      const data = processData(responseJSON.data);
      console.log("PROCESSING");
      setProcessedData(data);
    }
  }, [isLoading]);

  useEffect(() => {

    const chart = createChart(miniChartContainerRef.current, {
      crosshair: {
        mode: CrosshairMode.Normal, // Use CrosshairMode.Normal to allow tooltip functionality without line
        vertLine: {
          visible: false,
          labelVisible: false,
        },
        horzLine: {
          visible: false,
          labelVisible: false,
        },
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
        },
      },
      handleScroll: {
        mouseWheel: false,
        pressedMouseMove: false,
      },
      handleScale: {
        mouseWheel: false,
        pinch: false,
        axisDoubleClickReset: false,
        axisPressedMouseMove: {
          time: false,
          price: false,
        },
      },
      layout: {
        background: { type: ColorType.Solid, color: "#121212" },
      },
      width: 100,
      height: 50,
      timeScale: {
        visible: false,
        borderVisible: false,
      },
      rightPriceScale: {
        visible: false,
        borderVisible: false,
      },
    });

    

    const newSeries = chart.addAreaSeries({
      topColor: "rgba(33, 150, 243, 0.56)",
      bottomColor: "rgba(33, 150, 243, 0.04)",
      lineColor: "#18CCCC",
    });

    newSeries.applyOptions({
        lineWidth: 2, // Change the line width
        crosshairMarkerRadius: 3 // Change the radius of the crosshair marker.
    });

    newSeries.setData(processedData);
    chart.timeScale().fitContent();
    // chart.timeScale().lockVisibleTimeRangeOnResize = true;

    // Cleanup function for the chart
    return () => {
      chart.remove(); // Uncomment this and fix reference to actual chart instance
    };
  }, [processedData]);

  return <div ref={miniChartContainerRef}></div>;
}
