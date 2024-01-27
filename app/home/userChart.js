'use client'

import React, { useEffect, useState } from "react";
import { createChart } from "lightweight-charts";
import "../globals.css";

function unixTimestampToDate(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// intervals and seriesesData stay the same, so they are not included in the component
const intervals = ['1D', '1W', '1M', '1Y'];
// ... define seriesesData here ...

// function unixTimestampToDate(unixTimestamp) {
//   const date = new Date(unixTimestamp * 1000); 
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0'); 
//   const day = String(date.getDate()).padStart(2, '0'); 
//   return `${year}-${month}-${day}`;




  
var weekData = [
  { time: '2019-01-07', value: 25.92 },
  { time: '2019-01-14', value: 25.60 },
  { time: '2019-01-21', value: 25.80 },
  { time: '2019-01-28', value: 25.60 },
  { time: '2019-02-04', value: 25.72 },
  { time: '2019-02-11', value: 25.89 },
  { time: '2019-02-18', value: 26.00 },
  { time: '2019-02-25', value: 25.86 },
  { time: '2019-03-04', value: 25.94 },
  { time: '2019-03-11', value: 26.11 },
  { time: '2019-03-18', value: 25.88 },
  { time: '2019-03-25', value: 25.77 },
  { time: '2019-04-01', value: 26.16 },
  { time: '2019-04-08', value: 26.04 },
  { time: '2019-04-15', value: 26.00 },
  { time: '2019-04-22', value: 25.88 },
  { time: '2019-04-29', value: 26.02 },
  { time: '2019-05-06', value: 26.08 },
  { time: '2019-05-13', value: 26.09 },
  { time: '2019-05-20', value: 26.16 },
  { time: '2019-05-27', value: 26.23 },
  ];

  
var monthData = [
  { time: '2017-12-01', value: 25.82 },
  { time: '2018-01-01', value: 26.06 },
  { time: '2018-02-01', value: 25.78 },
  { time: '2018-03-01', value: 25.75 },
  { time: '2018-04-02', value: 25.72 },
  { time: '2018-05-01', value: 25.75 },
  { time: '2018-06-01', value: 26.58 },
  { time: '2018-07-02', value: 26.14 },
  { time: '2018-08-01', value: 25.86 },
  { time: '2018-09-03', value: 25.67 },
  { time: '2018-10-01', value: 25.82 },
  { time: '2018-11-01', value: 25.41 },
  { time: '2018-12-03', value: 25.77 },
  { time: '2019-01-01', value: 25.35 },
  { time: '2019-02-01', value: 25.79 },
  { time: '2019-03-01', value: 25.77 },
  { time: '2019-04-01', value: 25.90 },
  { time: '2019-05-01', value: 26.23 },
  ];

var yearData = [
  { time: '2012-01-02', value: 24.84 },
  { time: '2013-01-01', value: 25.26 },
  { time: '2014-01-01', value: 24.98 },
  { time: '2015-01-01', value: 25.95 },
  { time: '2016-01-01', value: 25.55 },
  { time: '2017-01-02', value: 25.70 },
  { time: '2018-01-01', value: 26.06 },
  { time: '2019-01-01', value: 26.23 },
  ];


// The SimpleSwitcher component
const SimpleSwitcher = ({ items, activeItem, setActiveItem }) => {
  
  const handleClick = item => {
    if (item !== activeItem) {
      setActiveItem(item);
    }
  };

  return (
    <div className="switcher">
      {
        items.map(item => (
          <button
            key={item}
            className={`switcher-item ${item === activeItem ? "switcher-active-item" : ""}`}
            onClick={() => handleClick(item)}
          >
            {item}
          </button>
        ))
      }
    </div>
  );
};

// The Chart component
const Chart = ({ activeInterval }) => {

  const [dayData, setDayData] = useState([{time:"0000-00-00", value:0}]);
  var seriesesData = new Map([
    ['1D', dayData ],
    ['1W', weekData ],
    ['1M', monthData ],
    ['1Y', yearData ],
    ]);
  
  const [chart, setChart] = useState(null);
  const [areaSeries, setAreaSeries] = useState(null);

  useEffect( () => {
    fetch("/api/history", {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "period": "1W",
        "timeframe": "15Min"
      })
    }).then(async response => {
      const data = await response.json();
      let chartData = [];
  
      for (let i = 0; i < data.timestamp.length; i++) {
        chartData.push({time:unixTimestampToDate(data.timestamp[i]), value: data.equity[i]})
      }
  
      setDayData(chartData)
  
    }).catch(error => {
      console.log(error);
    })
  }, []);



  useEffect(() => {
    if (chart !== null) {
      const newAreaSeries = chart.addAreaSeries({
        topColor: 'rgba(76, 175, 80, 0.56)',
        bottomColor: 'rgba(76, 175, 80, 0.04)',
        lineColor: 'rgba(76, 175, 80, 1)',
        lineWidth: 2,
      });
      newAreaSeries.updateData(seriesesData.get(activeInterval));
      
    }
  }, [activeInterval]);

  useEffect(() => {
    const newChart = createChart(document.getElementById("chart"), {
      width: 600,
      height: 300,
      layout: {
        background: {
          type: 'solid',
          color: '#000000',
        },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          color: 'rgba(42, 46, 57, 0.5)',
        },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
      },
      crosshair: {
        horzLine: {
          visible: false,
        },
      },
    });
  
    setChart(newChart);

    return () => [newChart.remove()]

  }, []);

  return <div id="chart"></div>;
};

// The main component
export default function UserChart() {
  
  const [activeInterval, setActiveInterval] = useState(0);

  useEffect( () => {
    setActiveInterval('1D');
  }, []);

  return (
    <body>
      <div>
        <Chart activeInterval={activeInterval} />
        <SimpleSwitcher items={intervals} activeItem={activeInterval} setActiveItem={setActiveInterval} />
      </div>
    </body>
  );
};

