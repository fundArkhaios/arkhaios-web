import { useEffect, useRef, useState } from "react";
import { ColorType, createChart, CrosshairMode } from "lightweight-charts";
import SmallDayChart from "./smallDayChart";
import WatchlistSmallDayChart from "./watchlistSmallDayChart";
import useFetch from "../hooks/useFetch";

export default function Watchlist({ user }) {
  const [positions, setPositions] = useState([]);

  const { isLoading, error, responseJSON } = useFetch("/api/chart");
  
  useEffect(() => {
    async function getPositions() {
      try {
        const response = await fetch("/api/account/watchlist", {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setPositions(data.data);
      } catch (error) {
        console.error(error);
      }
    }
    getPositions();
  }, []);


  async function handleUnbookmark(symbol) {
    setPositions(currentPositions => currentPositions.filter(pos => pos !== symbol));
    try {
      const response = await fetch("/api/account/watchlist", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol,
        }),
      });
      const data = await response.json();
    } catch (error) {
      console.error("Error handling bookmark request:", error);
    }
  }

  // Function to get the appropriate image URL for the symbol
  // Might need this function later
  /* const getImageUrl = (symbol, exchange) => {
    if (exchange === "CRYPTO") {
      const cryptoSymbol = symbol.replace("USD", "").toLowerCase();
      return `https://assets.coincap.io/assets/icons/${cryptoSymbol}@2x.png`;
    } else {
      return `https://logos.stockanalysis.com/${symbol.toLowerCase()}.svg`;
    }
  };
 */
  return (
    <div className="rounded-sm w-80 h-80 backdrop-blur-xl">
      <div className="relative rounded-sm">
        <div className="bg-[#121212] rounded-sm">
          <div className="border-b border-amber-200 px-2">
            <div className="grid grid-cols-2 px-1 py-2">
              <p className="text-amber-100 font-light">Watchlist</p>
              <button className="text-amber-100 justify-self-end px-2 text-sm font-extralight">
                Filter
              </button>
            </div>
          </div>
          <div className="overflow-auto h-80">
            {positions?.map((position) => (
              <div
                key={position}
                className="grid grid-cols-3 bg-[#121212] space-y-2 px-1"
              >
                <div className="flex pt-3 pl-1">
                  <button className="py-1 px-1 pr-3" onClick={() => handleUnbookmark(position)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#fde047"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="#fde047"
                      className="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                      />
                    </svg>
                  </button>
                  <div className="place-self-center text-sm text-white">
                    {position}
                  </div>
                </div>

                <WatchlistSmallDayChart symbol={position} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
