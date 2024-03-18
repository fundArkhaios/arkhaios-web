import useFetch from "../hooks/useFetch";
import { useState, useRef, useEffect } from "react";
import {
  ColorType,
  createChart,
  CrosshairMode,
  LineStyle,
} from "lightweight-charts";

export default function SmallDayChart({ position }) {
  const miniChartContainerRef = useRef();

  const [currentPrice, setCurrentPrice] = useState(position?.currentPrice);
  const [chartColor, setChartColor] = useState("#FF5000");
  useEffect(() => {
    if (position.exchange == "CRYPTO") {
      position.symbol = position.symbol.replace(/USD$/, "-usd").toLowerCase();
    }

    if (Number(position.unrealized_intraday_plpc) >= 0) {
      setChartColor("#18CCCC");
    } else {
      setChartColor("#FF5000");
    }
  }, []);

  const { responseJSON, isLoading, error } = useFetch(
    "/api/chart?symbol=" + position.symbol + "&range=1d&interval=5m"
  );

  const [processedData, setProcessedData] = useState([{ time: 0, value: 0 }, {time: 1, value: 0}]);

  useEffect(() => {
    // This function will process the responseJSON data
    function processData(data) {
        let result = [];
        for (let i = 0; i < data.timestamps.length; i++) {
          const value = parseFloat(data.closes[i]);


          if (!isNaN(value)) {  // Check if the value is a number

            if (i == data.timestamps.length - 1) setCurrentPrice(value);
            result.push({
              time: data.timestamps[i] * 1000,
              value: value,
            });
          }
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
  }, [responseJSON]);

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
      height: 40,
      timeScale: {
        visible: false,
        borderVisible: false,
      },
      rightPriceScale: {
        visible: false,
        borderVisible: false,
      },
    });

    const newSeries = chart.addLineSeries({});

    newSeries.applyOptions({
      color: chartColor,
      lineWidth: 2, // Change the line width
      crosshairMarkerRadius: 3, // Change the radius of the crosshair marker.
    });

    newSeries.setData(processedData);
    chart.timeScale().fitContent();
    // chart.timeScale().lockVisibleTimeRangeOnResize = true;



    function onCrosshairMove(param) {
      const seriesData = param.seriesData.get(newSeries);
      if (param === undefined || !param.time || !param.seriesData.size) {
        setCurrentPrice(position.current_price); // Revert to original value if crosshair is not on the chart
        return;
      }
      
      if (seriesData) {
        const { time, value: price } = seriesData;
        const chartIndex = processedData.findIndex(data => data.time === time && data.value === price);
    
        if (chartIndex !== -1) {
          setCurrentPrice(price);
        } else {
          setCurrentPrice(position.current_price)
          
        }
      }
    }
    chart.subscribeCrosshairMove(onCrosshairMove);

    // Cleanup function for the chart
    return () => {
      chart.remove(); // Uncomment this and fix reference to actual chart instance
      chart.unsubscribeCrosshairMove();
    };
  }, [processedData, chartColor]);

  return (
    <>
      <div className="font-thin text-xs text-center text-white">
        {"$" + Number(currentPrice).toLocaleString("en-US")}
      </div>
      <div ref={miniChartContainerRef}></div>
    </>
  );
}
