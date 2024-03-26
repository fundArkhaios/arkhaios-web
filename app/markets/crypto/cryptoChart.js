"use client";
import { useState, useRef, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import {
  ColorType,
  createChart,
  CrosshairMode,
  LineStyle,
} from "lightweight-charts";
import Error from 'next/error';

export default function CryptoChart({ symbol }) {
  const chartContainerRef = useRef();

  const [payload, setPayload] = useState({ range: "1mo", interval: "5m" });
  const { error, isLoading, responseJSON } = useFetch(
    "/api/chart?symbol=" +
      symbol +
      "&range=" +
      payload.range +
      "&interval=" +
      payload.interval
  );




    const [chartData, setChartData] = useState( [{time: 0, value: 0}, {time:1, value:0}] );
    const [chartLoaded, setChartLoaded] = useState(false);

    async function processChartData(timestamps, closes) {
        let lastValidClose = closes[0] !== null ? closes[0] : 0; // Initialize with the first value or 0 if the first value is null
      
        const response = (timestamps || []).map((timestamp, index) => {
            
          if (closes[index] === null) {
            closes[index] = lastValidClose;
          } else {
            lastValidClose = closes[index];
          }
      
          // Convert UNIX timestamp to a Date object, then to the required format
          const date = new Date(timestamp * 1000);
          const formattedDate = date.toISOString().split('T')[0]; // Example formatting, adjust if needed
      
          return { time: timestamp, value: closes[index] };
        });
      
        return response;
      }

  useEffect(() => {
    if (error) {
      return <Error statusCode={404} />;
    }


    async function getChartData() {
      if (responseJSON && !isLoading) {
        setChartLoaded(false);
        setChartData(await processChartData(responseJSON.data.timestamps, responseJSON.data.closes));
        setChartLoaded(true);
      }
    }
    getChartData();
  }, [isLoading]);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: 700,
      height: 300,
      localization: {
        timeFormatter: (businessDayOrTimestamp) => {
            const date = new Date(businessDayOrTimestamp * 1000);
            console.log("BusinessDayOrTimeStamp: " + businessDayOrTimestamp);
            console.log("Date: " + date);
            if (["1M", "6M"].includes(payload.range)) {
              // For '1M' and '6M', show only month and day
              return `${date.getMonth() + 1}-${date.getDate()}`;
            } else {
              // For '1D' and '1W', show time in 12-hour format
              const hours = date.getHours();
              const minutes = date.getMinutes();
              const ampm = hours >= 12 ? "PM" : "AM";
              const formattedHours = hours % 12 || 12; // Convert "0" hour to "12"
              const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
              return `${formattedHours}:${formattedMinutes} ${ampm}`;
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
            tickMarkFormatter: (time, tickMarkType, locale) => {
              const date = new Date(time * 1000);
              if (["1mo", "6M"].includes(payload.range)) {
                // For '1M' and '6M', show only month and day
                return `${date.getMonth() + 1}-${date.getDate()}`;
              } else if (payload.range === "5d") {
                // For '1W', show the day of the week
                return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                  date.getDay()
                ];
              } else {
                // For '1D', show time in 12-hour format
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const ampm = hours >= 12 ? "PM" : "AM";
                const formattedHours = hours % 12 || 12; // Convert "0" hour to "12"
                const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
                return `${formattedHours}:${formattedMinutes} ${ampm}`;
              }
            },
          },
          rightPriceScale: {
            borderVisible: false,
          },
          layout: {
            background: { type: ColorType.Solid, color: "#141416" },
            textColor: "#FFFFFF",
          },
      }
      );

    const newSeries = chart.addAreaSeries({
      topColor: "rgba(253, 243, 50, 0.56)",
      bottomColor: "rgba(253, 243, 0, 0.00)",
      lineColor: "#FDE68A",
    });

    newSeries.applyOptions({
      lineWidth: 2,
    });

    newSeries.setData(chartData);
    chart.timeScale().fitContent();

    return () => {
        chart.remove();
    }

  }, [chartLoaded, responseJSON]);

  return (
    <>
      <div ref={chartContainerRef}></div>
    </>
  );
}
