import { useRef, useEffect, useState } from "react";

import {
  ColorType,
  createChart,
  CrosshairMode,
  LineStyle,
} from "lightweight-charts";
import "../../output.css";
import "../globals.css";

/*

  This component includes the price and percent change on top of the chart.
  It also includes a radio input field below the chart, to select a different range. 
  The supported ranges are: [1 Day, 1 Week, 1 Month, 6 Months, 1 Year]
  The corresponding intervals which the price will be displayed based on 
  the range are, respectively: [1 Minute, 15 Minutes, 1 Day, 1 Day, 1 Day]

  As of writing this, the 'All Time' button does not work.
*/
export default function VerifiedHomeChart({ user }) {
  const chartContainerRef = useRef();
  const [percentChange, setPercentChange] = useState(0)
  const [response, setResponse] = useState({
    base_value: 0,
    profit_loss_pct: [0],
  });
  const [currentPrice, setCurrentPrice] = useState(response.base_value);
  const [chartData, setChartData] = useState([
    { time: "2018-12-22", value: 0 },
  ]);

  const payload = { period: "1M", timeframe: "1D" };

  const [historyPayload, setHistoryPayload] = useState(payload);

  async function convertData(timestamps, equity) {
    
    const data = (timestamps || []).map((timestamp, index) => {
      const date = new Date(timestamp * 1000); // Convert UNIX timestamp to milliseconds
      var formattedDate = "";

      formattedDate = timestamp;
      console.log("Formatted Date: " + formattedDate);

      // Set the current price for loading.
      if (index == equity.length - 1) setCurrentPrice(equity[index]);
      return { time: formattedDate, value: equity[index] };
    });
    return data;
  }

  useEffect(() => {
    async function getHistory() {
      fetch("/api/history", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(historyPayload),
      }).then(async (response) => {
        const data = await response.json();

        setResponse(data.data.history);
        setChartData(await convertData(data.data.history.timestamp, data.data.history.equity));
        // setCurrentPrice(await data.data.history.equity[equity.length - 1]);
        // console.log("Chart Data: " + chartData);
      });
    }
    getHistory();
  }, [historyPayload]);

  function generateTimestamps(startDate, initialValue = 0) {
    const start = new Date(startDate);
    console.log("Start Data: " + start);

    const today = new Date();

    const timestamps = [];

    for (
      let date = new Date(start);
      date <= today;
      date.setDate(date.getDate() + 1)
    ) {
      const formattedDate = date.toISOString().split("T")[0];
      timestamps.push({ time: formattedDate, value: initialValue });
    }

    return timestamps;
  }

  // Example usage:
  /* const startDate = '2018-12-22'; // Your initial start date
      const timestamps = generateTimestamps(startDate);
      console.log(timestamps); */
  let initialData = [];
  useEffect(() => {
    initialData = convertData(chartData.timestamp, chartData.equity);
  }, [chartData]);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: 700,
      height: 300,
      localization: {
        timeFormatter: (businessDayOrTimestamp) => {
          const date = new Date(businessDayOrTimestamp * 1000);
          console.log("BusinessDayOrTimeStamp: " + businessDayOrTimestamp);
          console.log("Date: " + date);
          if (["1M", "6M"].includes(historyPayload.period)) {
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
      crosshair: {
        mode: CrosshairMode.Magnet,

        // Vertical crosshair line (showing Date in Label)
        vertLine: {
          width: 4,
          color: "#C3BCDB44",
          style: LineStyle.Solid,
          labelBackgroundColor: "#FEF08A",
          tickMarkFormatter: (time, tickMarkType, locale) => {
            // Convert Lightweight Charts time to a JavaScript Date object
            const date = new Date(time * 1000);
            // Extract hours and minutes
            let hours = date.getHours();
            const minutes = date.getMinutes();
            // Convert to a 12-hour format
            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12;
            hours = hours || 12; // the hour '0' should be '12'
            // Pad the minutes with leading zero
            const minutesStr = minutes < 10 ? "0" + minutes : minutes;
            // Format the time string
            return `${hours}:${minutesStr} ${ampm}`;
          },
        },

        // Horizontal crosshair line (showing Price in Label)
        horzLine: {
          style: LineStyle.Solid,
          color: "#C3BCDB44",
          labelBackgroundColor: "#FEF08A",
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
          if (["1M", "6M"].includes(historyPayload.period)) {
            // For '1M' and '6M', show only month and day
            return `${date.getMonth() + 1}-${date.getDate()}`;
          } else if (historyPayload.period === "1W") {
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
        background: { type: ColorType.Solid, color: "#141416" },
        textColor: "#FFFFFF",
      },

      rightPriceScale: {
        borderVisible: false,
      },
    });

    const newSeries = chart.addAreaSeries({
      topColor: "rgba(253, 243, 50, 0.56)",
      bottomColor: "rgba(253, 243, 0, 0.00)",
      lineColor: "#FDE68A",
    });

    newSeries.applyOptions( {
      lineWidth: 2,
    })

    newSeries.setData(chartData);
    chart.timeScale().fitContent();
    // chart.timeScale().lockVisibleTimeRangeOnResize = true;

    function onCrosshairMove(param) {
      if (param === undefined || !param.time || !param.seriesData.size) {
        setCurrentPrice(response.equity[response.equity.length - 1]); // Revert to original value if crosshair is not on the chart
        setPercentChange(response.profit_loss_pct[0]); // Assuming you want to revert to the first pct change
        return;
      }
    
      const seriesData = param.seriesData.get(newSeries);
      if (seriesData) {
        const { time, value: price } = seriesData;
        const chartIndex = chartData.findIndex(data => data.time === time && data.value === price);
    
        if (chartIndex !== -1) {
          setPercentChange(response.profit_loss_pct[chartIndex]);
          setCurrentPrice(price);
        } else {
          setCurrentPrice(response.equity[response.profit_loss_pct.length - 1])
          setPercentChange(response.profit_loss_pct[0]); // Revert to some default if not found
        }
      }
    }

    chart.subscribeCrosshairMove(onCrosshairMove);


    return () => {
      chart.remove();
      chart.unsubscribeCrosshairMove();
    };
  }, [chartData, historyPayload, response]);

  const handleRadioChange = (period) => {
    let timeframe = "1D"; // Default timeframe
    switch (period) {
      case "1D":
        timeframe = "1Min";
        break;
      case "1W":
        timeframe = "5Min";
        break;
      case "1M":
        timeframe = "1D";
        break;
      case "6M":
        timeframe = "1D";
        break;
      // Add more cases if there are more periods with different timeframes
      default:
        timeframe = "1D"; // Fallback timeframe if none of the above matches
    }

    setHistoryPayload({ ...historyPayload, period, timeframe });
  };
  
  

  return (
    <>
      <div className="interBold text-2xl text-white">
     {"$" + Number(currentPrice).toLocaleString('en-US')}
      </div>
      {response.profit_loss_pct[response.profit_loss_pct.length - 1] >= 0 ? (
        <div className="text-sm text-[#18CCCC]">
          {historyPayload.period}{" "}
          {response.profit_loss_pct[response.profit_loss_pct.length - 1]}%
        </div>
      ) : (
        <div className="text-sm text-[#FF5000]">
          {historyPayload.period}{" "}
          {response.profit_loss_pct[response.profit_loss_pct.length - 1]}%
        </div>
      )}
      <div>{percentChange}</div>
      <div ref={chartContainerRef} id="verifiedChart"></div>
      <div className="text-center">
        <div className="join p-2 self-center">
          {["1D", "1W", "1M", "6M", "All Time"].map((period) => (
            <input
              key={period}
              type="radio"
              name="options"
              aria-label={period}
              className="btn join-item btn-sm"
              checked={historyPayload.period === period}
              onChange={() => handleRadioChange(period)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
