"use client";
import { useState, useRef, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import {
  ColorType,
  createChart,
} from "lightweight-charts";
import response_type from "../../../api/response_type";

export default function StockChart({ symbol }) {
  const chartContainerRef = useRef();

  const [chartColor, setChartColor] = useState({
    topColor: "rgba(24, 204, 204, 0.56)",
    bottomColor: "rgba(24, 204, 204, 0.00)",
    lineColor: "#18CCCC",
  });
  const [payload, setPayload] = useState({ interval: "1d" });

  const { error, isLoading, responseJSON } = useFetch(
    "/api/fund/history?symbol=" + symbol + "&period=" + payload.interval
  );

  const [chartData, setChartData] = useState([
    { time: 0, value: 0 },
    { time: 1, value: 0 },
  ]);

  const [currentPrice, setCurrentPrice] = useState(chartData[0].value);

  const [chartLoaded, setChartLoaded] = useState(false);

  async function processChartData(timestamps, closes) {
    let lastValidClose = closes[0] !== null ? closes[0] : 0; // Initialize with the first value or 0 if the first value is null

    let lastTime = 0;
    const response = (timestamps || []).filter((timestamp) => {
      if(timestamp != lastTime) {
        lastTime = timestamp;
        return true;
      }

      return false;
    });
    
    return response.map((timestamp, index) => {
      if (closes[index] === null) {
        closes[index] = lastValidClose;
      } else {
        lastValidClose = closes[index];
      }

      const time = Math.floor(new Date(timestamp).getTime() / 1000);

      if (index == timestamps.length - 1) {
        setCurrentPrice(closes[index]);
      }
      return { time: time, value: closes[index] };
    });
  }

  useEffect(() => {
    async function getChartData() {
      if (responseJSON && !isLoading) {
        setChartLoaded(false);
        setChartData(
          await processChartData(
            responseJSON.timestamps,
            responseJSON.value
          )
        );
        setChartLoaded(true);

        const isPriceIncreasing =
          responseJSON.value[0] <=
          responseJSON.value[responseJSON.value.length - 1];

        setChartColor({
          topColor: !isPriceIncreasing
            ? "rgba(255, 80, 0, 0.56)"
            : "rgba(24, 204, 204, 0.56)",
          bottomColor: !isPriceIncreasing
            ? "rgba(255, 80, 0, 0.00)"
            : "rgba(24, 204, 204, 0.00)",
          lineColor: isPriceIncreasing ? "#18CCCC" : "#FF5000",
        });
      }
    }
    getChartData();
  }, [responseJSON]);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: 750,
      height: 350,
      localization: {
        timeFormatter: (businessDayOrTimestamp) => {
          const date = new Date(businessDayOrTimestamp);
          // When the range is 'max' show day, month, and year
          if (payload.range === "max") {
            return `${date.getUTCDate()}-${
              date.getUTCMonth() + 1
            }-${date.getUTCFullYear()}`;
          } else if (["6mo"].includes(payload.range)) {
            // For '1M' and '6M', show only month and day
            return `${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
          } else {
            // For '1D' and '1W', show time in 12-hour format
            let hours = date.getUTCHours();
            const minutes = date.getUTCMinutes();
            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12;
            hours = hours || 12; // the hour '0' should be '12'
            const minutesStr = minutes < 10 ? "0" + minutes : minutes;
            return `${hours}:${minutesStr} ${ampm}`;
          }
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
      timeScale: {
        borderVisible: false,
        rightOffset: 50,
        barSpacing: 10,
        fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true,
        borderColor: "#fff000",
        visible: true,
        timeVisible: true,
        tickMarkFormatter: (() => {
          let lastDisplayedDay = null;
          return (time, tickMarkType, locale) => {
            const date = new Date(time);
            const dayOfWeek = date.getUTCDay();
            const dayOfMonth = date.getDate();
            if (payload.range === "max") {
              return date.getUTCFullYear().toString();
            } else if (["1mo", "6mo", "max"].includes(payload.range)) {
              // For '1M' and '6M', show only month and day
              return `${date.getMonth() + 1}-${dayOfMonth}`;
            } else if (payload.range === "5d") {
              // For '1W', show the day of the week, but only if it hasn't been displayed yet
              if (dayOfMonth !== lastDisplayedDay) {
                lastDisplayedDay = dayOfMonth; // Update the last displayed day
                return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                  dayOfWeek
                ];
              }
              return ""; // If this day has been displayed, return an empty string
            } else {
              // For '1D', show time in 12-hour format
              const hours = date.getHours();
              const minutes = date.getMinutes();
              const ampm = hours >= 12 ? "PM" : "AM";
              const formattedHours = hours % 12 || 12; // Convert "0" hour to "12"
              const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
              return `${formattedHours}:${formattedMinutes} ${ampm}`;
            }
          };
        })(),
      },
      rightPriceScale: {
        borderVisible: false,
      },
      layout: {
        background: { type: ColorType.Solid, color: "#141416" },
        textColor: "#FFFFFF",
      },
    });

    const newSeries = chart.addAreaSeries({
      ...chartColor,
    });

    newSeries.applyOptions({
      lineWidth: 2,
    });

    newSeries.setData(chartData);
    chart.timeScale().fitContent();


    function onCrosshairMove(param) {
      if (param === undefined || !param.time || !param.seriesData.size) {
        setCurrentPrice(chartData[chartData.length - 1].value); // Revert to original value if crosshair is not on the chart
        // setPercentChange(response.profit_loss_pct[response.profit_loss_pct.length - 1] == null ? 0 : response.profit_loss_pct[response.profit_loss_pct.length - 1]); // Assuming you want to revert to the first pct change
        return;
      }
    
      const seriesData = param.seriesData.get(newSeries);
      if (seriesData) {
        const { time, value: price } = seriesData;
        const chartIndex = chartData.findIndex(data => data.time === time && data.value === price);
    
        if (chartIndex !== -1) {
          // Check if the values are null.
          // setPercentChange(response.profit_loss_pct[chartIndex] == null ? 0 : response.profit_loss_pct[chartIndex]);
          setCurrentPrice(price == null ? 0 : price);
        } else {
          // This means that the mouse is not on the screen and we can go back and display the last index in the array.
          setCurrentPrice(chartData[chartData.length - 1].value == null ? 0 : chartData[chartData.length - 1].value)
          // setPercentChange(response.profit_loss_pct[response.profit_loss_pct.length - 1] == null ? 0 : response.profit_loss_pct[response.profit_loss_pct.length - 1]); // Revert to some default if not found
        }
      }
    }
    chart.subscribeCrosshairMove(onCrosshairMove);

    return () => {
      setChartLoaded(false);
      chart.remove();
      chart.unsubscribeCrosshairMove();
    };
  }, [chartLoaded, chartData]);

  const rangeMapping = {
    "1D": "1d",
    "1W": "5d",
    "1M": "1mo",
    "6M": "6mo",
    "All Time": "max",
  };
  const handleRadioChange = (buttonRange) => {
    let payloadRange;
    let interval = "1d"; // Default interval

    // Use the mapping to set the payload range and interval
    payloadRange = rangeMapping[buttonRange];
    switch (buttonRange) {
      case "1D":
        interval = "1d";
        break;
      case "1W":
        interval = "1w";
        break;
      case "1M":
        interval = "1m";
        break;
      default:
        interval = "1d"; // Fallback interval if none of the above matches
    }

    setPayload({ range: payloadRange, interval });
  };

  return (
    <>
      <div className="interBold text-2xl text-white">
        {"$" + Number(currentPrice).toLocaleString("en-US")}
      </div>
      <div ref={chartContainerRef} className=""></div>
      <div className="text-center">
        <div className="join p-2 self-center">
          {["1D", "1W", "1M"].map((buttonRange) => (
            <input
              key={buttonRange}
              type="radio"
              name="options"
              aria-label={buttonRange}
              className="btn join-item btn-sm"
              checked={payload.range === rangeMapping[buttonRange]}
              onChange={() => handleRadioChange(buttonRange)}
            />
          ))}
        </div>
      </div>
    </>
  );
}