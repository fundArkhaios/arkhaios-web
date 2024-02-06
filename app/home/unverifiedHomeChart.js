import { useRef, useEffect } from "react";
import { ColorType, createChart } from "lightweight-charts";

export default function unverifiedHomeChart({user}) {

    const chartContainerRef = useRef();

    


    function generateTimestamps(startDate, initialValue = 0) {
        // Parse the start date and create a Date object
        const start = new Date(startDate);
        console.log("Start Data: " + start)
        // Create a new Date object for the current date
        const today = new Date();
        
        // Initialize an empty array to hold the timestamps
        const timestamps = [];
        
        // Loop from the start date to today, one day at a time
        for (let date = new Date(start); date <= today; date.setDate(date.getDate() + 1)) {
          // Format the current date as a string
          const formattedDate = date.toISOString().split('T')[0];
          
          // Push an object with the formatted date and initial value to the array
          timestamps.push({ time: formattedDate, value: initialValue });
        }
        
        // Return the array of timestamps
        return timestamps;
      }
      
      // Example usage:
      /* const startDate = '2018-12-22'; // Your initial start date
      const timestamps = generateTimestamps(startDate);
      console.log(timestamps); */

      
    useEffect( () => {
        const initialData = generateTimestamps(user.creationTime);

        const chart = createChart(chartContainerRef.current, {
            grid: {
                vertLines: {
                    visible: false,
                },
                horzLines: {
                    visible: false,
                },
            },
            layout: {
                background: {type: ColorType.Solid, color: "rgb(14, 17, 21)"},
            },
            width: 1200,
            height:400,
            timeScale: {
                borderVisible: false
            },
            rightPriceScale: {
                borderVisible: false,
            }
        });

        const newSeries = chart.addAreaSeries({

            topColor: 'rgba(33, 150, 243, 0.56)',
			bottomColor: 'rgba(33, 150, 243, 0.04)',
			lineColor: 'rgba(33, 150, 243, 1)',

        })


        newSeries.setData(initialData);
        chart.timeScale().fitContent();
        chart.timeScale().lockVisibleTimeRangeOnResize = true;

        return() => [chart.remove()]
    })

    return(
        <>
        <div className="interBold text-2xl text-white">$0.00</div>
        <div className="text-sm text-white">1D - 0% (UP ARROW)</div>
        <div ref = {chartContainerRef}></div>
        </>

    )


}