"use client";

import { min } from "lodash";
import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";

export default function TopLeft({ fund }) {
  const [totalAUM, setTotalAUM] = useState(0);
  const [dailyPercentChange, setDailyPercentChange] = useState(0);
  const [timeUntilTerm, setTimeUntilTerm] = useState(0);

  const { error, isLoading, responseJSON } = useFetch(
    "/api/fund/history?symbol=" + fund.fundSymbol + "&period=1d"
  );

  const [totalTimeUntilDistribution, setTotalTimeUntilDistribution] = useState();

  // This function updates the countdown.
  const updateCountdown = () => {
    const now = Date.now();

    if(fund.fundRecruiting) {
      const timestamp = fund.recruitEnd * 1000; // Assuming fund.fundRecruiting is a Unix timestamp in seconds
      const timeLeft = timestamp - now;
      setTimeUntilTerm(timeLeft > 0 ? timeLeft : 0); // Update the state with the time left until the term
    } else {
      console.log(totalTimeUntilDistribution);
      const timestamp = Math.floor(totalTimeUntilDistribution / 1000) * 1000; // Assuming fund.fundRecruiting is a Unix timestamp in seconds
      const timeLeft = timestamp - now;
      setTimeUntilTerm(timeLeft > 0 ? timeLeft : 0); // Update the state with the time left until the term 
    }
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
    console.log("loaded");
    console.log(responseJSON);
    if (responseJSON && responseJSON.value) {

      console.log("yo!");
      console.log(responseJSON.value)
      if(responseJSON.value.length) {
        const finalValue = responseJSON.value[responseJSON.value.length - 1];

        setTotalAUM(finalValue);

        if (fund.startValue) {
          setDailyPercentChange(
            ((finalValue - fund.startValue) / fund.startValue) * 100
          );
        }
      }

      console.log("yo");
      
      if (fund.fundRecruiting === false) {
        console.log("not recruit");
        const recruitmentEndDate = new Date(fund.recruitEnd * 1000); // Convert Unix timestamp to JavaScript date
        console.log("fund time");
        console.log(recruitmentEndDate);
        switch (fund.fundDisbursementPeriod) {
          case "quarterly":
            recruitmentEndDate.setDate(recruitmentEndDate.getDate() + 91);
            setTotalTimeUntilDistribution(recruitmentEndDate);
            break;
          case "monthly":
            recruitmentEndDate.setDate(recruitmentEndDate.getDate() + 30);
            setTotalTimeUntilDistribution(recruitmentEndDate);
            break;
          case "daily":
            recruitmentEndDate.setDate(recruitmentEndDate.getDate() + 1);
            setTotalTimeUntilDistribution(recruitmentEndDate);
            break;
          case "hourly":
            recruitmentEndDate.setHours(recruitmentEndDate.getHours() + 1);
            setTotalTimeUntilDistribution(recruitmentEndDate);
            break;
          case "5min":
            recruitmentEndDate.setMinutes(recruitmentEndDate.getMinutes() + 5);
            setTotalTimeUntilDistribution(recruitmentEndDate);
            break;
          case "1min":
            recruitmentEndDate.setMinutes(recruitmentEndDate.getMinutes() + 1);
            console.log("new date");
            console.log(recruitmentEndDate);
            setTotalTimeUntilDistribution(recruitmentEndDate);
            break;
          default:
            // Handle unexpected disbursementPeriod values or set a default
            console.error('Invalid disbursement period');
            break;
        }
      }
  
    }
  }, [isLoading]);

  console.log(fund);

  const DistributionCountDownTimer = () => {
    const { days, hours, minutes, seconds } = formatTime(timeUntilTerm);

    console.log("distro");
    console.log(days);
    console.log(hours);
    console.log(seconds);
    if(days == 0 && hours == 0 && minutes == 0 && seconds == 0) {
      return (
        <div className="flex gap-5">
          <div>
            <span className="text-5xl font-bold">
              Term Ending...
            </span>
          </div>
        </div>
      );
    } else {
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
    }
  }


  const CountDownTimer = () => {
    const { days, hours, minutes, seconds } = formatTime(timeUntilTerm);

    if(days == 0 && hours == 0 && minutes == 0 && seconds == 0) {
      return (
        <div className="flex gap-5">
          <div>
            <span className="text-5xl font-bold">
              Term Starting...
            </span>
          </div>
        </div>
      );
    } else {
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
        </div>);
    }
  };

  return (
    <div className="self-center">
      <div className=" grid grid-rows-2 grid-cols-3 place-self-center place-content-center gap-16">
        <div className="col-span-1">
          <p className="text-5xl font-bold">${totalAUM?.toFixed(2) || 0}</p>
          <p className="text-xs font-thin">AUM</p>
        </div>
        <div className="col-span-1">
          <p className="text-5xl font-bold">{dailyPercentChange?.toFixed(2)}%</p>
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
          {fund.fundRecruiting === true ? <CountDownTimer/> : <DistributionCountDownTimer/>}
          <p className="text-xs font-thin">{fund.fundRecruiting === true ? "Time until Term Period": "Time until distribution."}</p>
        </div>
        <div className="col-span-1">
          <p className="text-5xl font-bold">{fund.fundRecruiting === true ? "Recruiting" : "Trading"}</p>
          <p className="text-xs font-thin">Fund Stage</p>
        </div>
      </div>
    </div>
  );
}
