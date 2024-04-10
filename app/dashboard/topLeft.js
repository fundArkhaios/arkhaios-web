"use client";

import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";

export default function TopLeft({ fund }) {
  const [totalAUM, setTotalAUM] = useState();
  const [dailyPercentChange, setDailyPercentChange] = useState(0);
  const [timeUntilTerm, setTimeUntilTerm] = useState(0);

  const { error, isLoading, responseJSON } = useFetch(
    "/api/fund/history?symbol=" + fund.fundSymbol + "&period=1m"
  );

  // This function updates the countdown.
  const updateCountdown = () => {
    const now = Date.now();
    const timestamp = fund.recruitEnd * 1000; // Assuming fund.fundRecruiting is a Unix timestamp in seconds
    const timeLeft = timestamp - now;
    setTimeUntilTerm(timeLeft > 0 ? timeLeft : 0); // Update the state with the time left until the term
  };


  useEffect(() => {
    // Set up the interval to update every second
    const intervalId = setInterval(() => {
      updateCountdown();
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [fund.fundRecruiting]);



  // Helper function to format timeUntilTerm into days, hours, minutes, and seconds
  const formatTime = (time) => {
    let seconds = Math.floor(time / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    return { days, hours, minutes, seconds };
  };


  useEffect(() => {
    if (responseJSON && responseJSON.value) {
      const finalValue = responseJSON.value[responseJSON.value.length - 1];

      setTotalAUM(finalValue);

      if (fund.startValue) {
        setDailyPercentChange(
          (finalValue - fund.startValue - fund.startValue) * 100
        );
      }
      
      if (fund.fundRecruiting === false) {

          if (fund.disbursementPeriod == "quarterly") {
            // totalTimeUntilDistribution = Add 91 days to fund.recruitmentEnd
          } else if (fund.disbursementPeriod == "monthly") {
            // totalTimeUntilDistribution = Add 30 days to fund.recruitmentEnd
          } else if (fund.disbursementPeriod == "daily") {
            // totalTimeUntilDistribution = Add 24 hours to fund.recruitmentEnd
          } else if (fund.disbursementPeriod == "hourly") {
            // totalTimeUntilDistribution = Add 1 hour to fund.recruitmentEnd
          } else if (fund.disbursementPeriod == "5min") {
            // totalTimeUntilDistribution = Add 5 minutes to fund.recruitmentEnd
          }
      }
  
    }
  }, [isLoading]);

  console.log(fund);

  // Time until distribution = recruitEnd -

  



  const CountDownTimer = () => {
    const { days, hours, minutes, seconds } = formatTime(timeUntilTerm);

    return (
      <div className="flex gap-5">
        <div>
          <span className="text-4xl">
            <span className="font-bold">{days}</span>
            <p className="font-thin text-sm">days</p>
          </span>
          
        </div>
        <div>
          <span className=" text-4xl">
            <span className="font-bold">{hours}</span>
            <p className="font-thin text-sm">hours</p>
          </span>
        </div>
        <div>
          <span className=" text-4xl">
            <span className="font-bold">{minutes}</span>
            <p className="font-thin text-sm">minutes</p>
          </span>
        </div>
        <div>
          <span className=" text-4xl">
            <span className="font-bold">{seconds}</span>
            <p className="font-thin text-sm">seconds</p>
          </span>
          
        </div>
      </div>
    );
  };

  return (
    <div className="self-center">
      <div className=" grid grid-rows-2 grid-cols-3 place-self-center place-content-center gap-16">
        <div className="col-span-1">
          <p className="text-5xl font-bold">${totalAUM}</p>
          <p className="text-xs font-thin">AUM</p>
        </div>
        <div className="col-span-1">
          <p className="text-5xl font-bold">{dailyPercentChange}%</p>
          <p className="text-xs font-thin">Percent Change</p>
        </div>
        <div className="col-span-1">
          <p className="text-5xl font-bold">{fund.members.length}</p>
          <p className="text-xs font-thin"># of Investors</p>
        </div>
        <div className="col-span-1">
          <p className="text-5xl font-bold">{fund.portfolioManagers.length}</p>
          <p className="text-xs font-thin"># of Portfolio Managers</p>
        </div>
        <div className="col-span-1">
          <CountDownTimer/>
          <p className="text-xs font-thin">Time until distribution.</p>
        </div>
        <div className="col-span-1">
          <p className="text-5xl font-bold">Inactive</p>
          <p className="text-xs font-thin">Fund Status</p>
        </div>
      </div>
    </div>
  );
}
