"use client";
import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import Link from "next/link";
import { NewspaperIcon } from "@heroicons/react/24/outline";

export default function StockNews( { symbol} ) {

    const [formattedCurrentDate, setFormattedCurrentDate] = useState('');
    const [formattedOneWeekBefore, setFormattedOneWeekBefore] = useState('');
    useEffect( () => {
        // Get current date
        let currentDate =  new Date();

        // Format as YYYY-MM-DD
        let formattedCurrent = currentDate.toISOString().split('T')[0];

        // Get date for 1 week before
        let oneWeekBefore = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Format the date from 1 week ago as YYYY-MM-DD
        let formattedWeekBefore = oneWeekBefore.toISOString().split('T')[0];

        setFormattedCurrentDate(formattedCurrent);
        setFormattedOneWeekBefore(formattedWeekBefore);

    
    }, [])


  const { isError, isLoading, responseJSON } = useFetch(
    "/api/account/get-stock-news?symbol=" + symbol + "&startDate=" + formattedOneWeekBefore + "&endDate=" + formattedCurrentDate
  );
  const [response, setResponse] = useState();

  useEffect(() => {
    if (responseJSON) {
      setResponse(responseJSON.data);
    }
  }, [responseJSON]);

  function timeSince(timestamp) {
    const now = Date.now(); // Get current timestamp in milliseconds
    const secondsPast = Math.floor(now / 1000 - timestamp); // Convert current timestamp to seconds and calculate difference

    if (secondsPast < 60) {
      return "Just now"; // If less than a minute ago
    } else if (secondsPast < 3600) {
      return Math.floor(secondsPast / 60) + " minutes ago"; // If less than an hour ago
    } else if (secondsPast < 86400) {
      return Math.floor(secondsPast / 3600) + " hours ago"; // If less than a day ago
    } else {
      return Math.floor(secondsPast / 86400) + " days ago"; // If one or more days ago
    }
  }

  return (
    <>
      <div className="lg:max-w-7xl py-5">
        {response?.map((article) => (
          <div key={article.id} className="py-1">
            <Link
              className="grid grid-cols-2 p-4 hover:bg-zinc-700 py-4 rounded-md"
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="">
                <div className="flex flex-row spacing-2">
                  <p className="font-bold text-sm text-amber-200 pr-2">
                    {article.source}
                  </p>
                  <p className="text-light text-xs place-self-center">
                    {timeSince(article.datetime)}
                  </p>
                </div>

                <p className="font-bold text-white">{article.headline}</p>
                <p className="font-thin text-white text-xs">
                  {article.summary}
                </p>
              </div>

              { article.image?.length ?
              <img
                className="justify-self-end rounded-md border border-white"
                src={article.image}
                width={170}
                height={100}
              ></img>
              :
              <div className="w-[170px] flex justify-center items-center h-[100px] justify-self-end rounded-md border border-white">
                <NewspaperIcon className="w-8 h-8"/>
              </div>
              }
            </Link>

            <div className="divider"></div>
          </div>
        ))}
      </div>
    </>
  );
}
