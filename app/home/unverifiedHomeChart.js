import { useRef, useEffect, useState } from "react";
import {
  ColorType,
  createChart,
  CrosshairMode,
  LineStyle,
} from "lightweight-charts";

export default function unverifiedHomeChart({ user }) {
  const chartContainerRef = useRef();

  const [chartData, setChartData] = useState([{ time: 0, value: 0 }]);
  

  /*
   Data should be generated based on when the account was created. 
   Using user.creationTime. We can for all the timeframes:


   1D: 24 Hours before up until current time. 1 Minute intervals. 

   1W: 1 Week before up until current time. 5 Minute intervals.

   1M: 1 month before up until current time. 1 Day intervals.

   6M: 6 months before up until current time. 1 Day intervals.

   1 Year: 1 Year before up until current time. 1 Day interval
   

  */

  function generateData(initialTimestamp, period, timeframe) {
    // Define the increments in milliseconds
    const increments = {
      "1Min": 60 * 1000,
      "5Min": 5 * 60 * 1000,
      "1D": 24 * 60 * 60 * 1000,
    };

    // Define the periods in milliseconds
    const periods = {
      "1D": 24 * 60 * 60 * 1000,
      "1W": 7 * 24 * 60 * 60 * 1000,
      "1M": 30 * 24 * 60 * 60 * 1000, // assuming 30 days in a month for simplicity
      "6M": 6 * 30 * 24 * 60 * 60 * 1000, // assuming 30 days in a month
      "All Time": Date.now() - initialTimestamp, // all time up to current time
    };

    // Calculate end time depending on the period
    let endTime = initialTimestamp + (periods[period] || periods["oneDay"]);
    let currentTime = Date.now();
    if (period === "allTime") {
      endTime = currentTime;
    }

    let timestamps = [];
    let incrementValue = increments[timeframe] || increments["day"];

    for (
      let time = initialTimestamp;
      time < endTime && time <= currentTime;
      time += incrementValue
    ) {
      timestamps.push({ time: time, value: 0 });
    }

    return timestamps;
  }

  const [response, setResponse] = useState({
    base_value: 0,
    profit_loss_pct: [0],
  });
  const [currentPrice, setCurrentPrice] = useState(response.base_value);

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

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: 600,
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

    newSeries.applyOptions({
      lineWidth: 2,
    });

    newSeries.setData(chartData);
    chart.timeScale().fitContent();

    // chart.timeScale().lockVisibleTimeRangeOnResize = true;



    return () => {
      chart.remove();
    };
  }, [chartData, historyPayload]);

  
    


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
        setChartData(generate);
        break;
      case "6M":
        timeframe = "1D";
        break;
      // Add more cases if there are more periods with different timeframes
      default:
        timeframe = "1D"; // Fallback timeframe if none of the above matches
    }
    setChartData(generateData(user.creationTime, period, timeframe));
    setHistoryPayload({ ...historyPayload, period, timeframe });
  };

  return (
    <>
      <div className="interBold text-2xl text-white">
        {"$" + Number(currentPrice).toLocaleString("en-US")}
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
      <div
        ref={chartContainerRef}
        id="unverifiedChart"
        style={{ width: "100%", height: "100%" }}
      ></div>
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
