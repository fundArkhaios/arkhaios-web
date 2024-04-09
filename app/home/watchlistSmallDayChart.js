import useFetch from "../hooks/useFetch";
import { useState, useRef, useEffect } from "react";
import {
  ColorType,
  createChart,
  CrosshairMode,
  LineStyle,
} from "lightweight-charts";

export default function WatchlistSmallDayChart({ symbol }) {
  const {
    isLoading: priceIsLoading,
    error: priceError,
    responseJSON: priceResponseJSON,
  } = useFetch("/api/quote?id=" + symbol);

  const [originalPrice, setOriginalPrice] = useState(0);
  const [percentChange, setPercentChange] = useState(0);

  const [currentPrice, setCurrentPrice] = useState(0);

  


  const miniChartContainerRef = useRef();

  const [chartColor, setChartColor] = useState("#FF5000");

  const { responseJSON, isLoading, error } = useFetch(
    "/api/chart?symbol=" + symbol + "&range=1d&interval=5m"
  );

  const [processedData, setProcessedData] = useState([
    { time: 0, value: 0 },
    { time: 1, value: 0 },
  ]);

  useEffect(() => {
    if (priceResponseJSON && priceResponseJSON.data) {
      setOriginalPrice(priceResponseJSON.data.price);
    }
  }, [priceIsLoading]);

  useEffect(() => {
    // This function will process the responseJSON data
    function processData(data) {
      let result = [];
      for (let i = 0; i < data.timestamps.length; i++) {
        const value = parseFloat(data.closes[i]);

        if (!isNaN(value)) {
          // Check if the value is a number

          if (i == data.timestamps.length - 1) {
            setOriginalPrice(value)
            setCurrentPrice(value);
          }
          result.push({
            time: data.timestamps[i] * 1000,
            value: value,
          });
        }
      }

      let initalValue = result[0].value;
      let lastValue = result[result.length - 1].value;
      if (initalValue >= lastValue) {
        setChartColor("#FF5000");
      } else {
        setChartColor("#18CCCC");
      }
      setPercentChange(100 * ((lastValue - initalValue)/initalValue))

      return result;
    }
    // Make sure responseJSON is not null and the promise has been resolved
    if (
      responseJSON &&
      !isLoading &&
      responseJSON.status != "error" &&
      responseJSON.data
    ) {
      const data = processData(responseJSON.data);
      setProcessedData(data);
    }
  }, [responseJSON]);

  useEffect(() => {
    const chart = createChart(miniChartContainerRef.current, {
      crosshair: {
        mode: CrosshairMode.Normal, // Use CrosshairMode.Normal to allow tooltip functionality without line
        vertLine: {
          visible: true,
          labelVisible: false,
          style: LineStyle.Solid,
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
      crosshairMarkerRadius: 2, // Change the radius of the crosshair marker.
    });

    newSeries.setData(processedData);
    chart.timeScale().fitContent();
    // chart.timeScale().lockVisibleTimeRangeOnResize = true;

    function onCrosshairMove(param) {
      const seriesData = param.seriesData.get(newSeries);
      if (param === undefined || !param.time || !param.seriesData.size) {
        setCurrentPrice(originalPrice); // Revert to original value if crosshair is not on the chart
        return;
      }

      if (seriesData) {
        const { time, value: price } = seriesData;
        const chartIndex = processedData.findIndex(
          (data) => data.time === time && data.value === price
        );

        if (chartIndex !== -1) {
          setCurrentPrice(price);
        } else {
          setCurrentPrice(originalPrice);
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
      <div className="px-2">
        <div className="font-thin text-xs text-center text-white">
          {"$" + Number(currentPrice).toLocaleString("en-US")}
        </div>
        <div ref={miniChartContainerRef}></div>
      </div>
      <div className="px-2 pl-2 pt-1 ">
        <div className="grid grid-cols-2 pt-2">
          {parseFloat(percentChange) >= 0 ? (
            <svg
              className="justify-self-end"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="16"
                height="16"
                rx="4"
                fill="#18CCCC"
                fillOpacity="0.1"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.9757 7.8242C3.86322 7.71168 3.80003 7.5591 3.80003 7.4C3.80003 7.2409 3.86322 7.08832 3.9757 6.9758L7.5757 3.3758C7.68822 3.26332 7.8408 3.20013 7.9999 3.20013C8.159 3.20013 8.31159 3.26332 8.4241 3.3758L12.0241 6.9758C12.0814 7.03115 12.1271 7.09735 12.1586 7.17056C12.19 7.24376 12.2066 7.32249 12.2073 7.40216C12.2079 7.48183 12.1928 7.56083 12.1626 7.63457C12.1324 7.70831 12.0879 7.7753 12.0315 7.83164C11.9752 7.88797 11.9082 7.93252 11.8345 7.96269C11.7607 7.99286 11.6817 8.00804 11.6021 8.00735C11.5224 8.00666 11.4437 7.99011 11.3705 7.95866C11.2973 7.92722 11.2311 7.88151 11.1757 7.8242L8.5999 5.2484V12.2C8.5999 12.3591 8.53669 12.5117 8.42417 12.6243C8.31165 12.7368 8.15903 12.8 7.9999 12.8C7.84077 12.8 7.68816 12.7368 7.57564 12.6243C7.46312 12.5117 7.3999 12.3591 7.3999 12.2L7.3999 5.2484L4.8241 7.8242C4.71159 7.93668 4.559 7.99987 4.3999 7.99987C4.24081 7.99987 4.08822 7.93668 3.9757 7.8242Z"
                fill="#18CCCC"
              />
            </svg>
          ) : (
            <svg
              className="justify-self-end"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="16"
                height="16"
                rx="4"
                fill="#FF5000"
                fillOpacity="0.1"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.0243 8.1758C12.1368 8.28831 12.2 8.4409 12.2 8.6C12.2 8.7591 12.1368 8.91168 12.0243 9.0242L8.4243 12.6242C8.31178 12.7367 8.1592 12.7999 8.0001 12.7999C7.841 12.7999 7.68841 12.7367 7.5759 12.6242L3.9759 9.0242C3.91859 8.96885 3.87288 8.90264 3.84144 8.82944C3.80999 8.75624 3.79344 8.6775 3.79275 8.59784C3.79205 8.51817 3.80724 8.43916 3.8374 8.36542C3.86757 8.29169 3.91212 8.2247 3.96846 8.16836C4.0248 8.11202 4.09179 8.06747 4.16553 8.0373C4.23926 8.00714 4.31827 7.99195 4.39794 7.99265C4.47761 7.99334 4.55634 8.00989 4.62954 8.04134C4.70274 8.07278 4.76895 8.11849 4.8243 8.1758L7.4001 10.7516V3.8C7.4001 3.64087 7.46331 3.48825 7.57583 3.37573C7.68835 3.26321 7.84097 3.2 8.0001 3.2C8.15923 3.2 8.31184 3.26321 8.42436 3.37573C8.53688 3.48825 8.6001 3.64087 8.6001 3.8V10.7516L11.1759 8.1758C11.2884 8.06331 11.441 8.00012 11.6001 8.00012C11.7592 8.00012 11.9118 8.06331 12.0243 8.1758Z"
                fill="#FF5000"
              />
            </svg>
          )}
          <p
            className={`text-xs font-light text-right ${
              parseFloat(percentChange) >= 0
                ? "text-[#18CCCC]"
                : "text-[#FF5000]"
            }`}
          >
            {`${(percentChange)?.toFixed(2)}%`}
          </p>
        </div>
      </div>
    </>
  );
}
