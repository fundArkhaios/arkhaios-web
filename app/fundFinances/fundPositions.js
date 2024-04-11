"use client";
import { useEffect, useRef, useState } from "react";
import { ColorType, createChart, CrosshairMode } from "lightweight-charts";
import SmallDayChart from "../home/smallDayChart";
import useFetch from "../hooks/useFetch";
import WatchlistSmallDayChart from "../home/watchlistSmallDayChart";

export default function FundPositions({ fundID }) {
  const [positions, setPositions] = useState([]);

  function changeToCrypto(symbol) {
    return symbol.replace(/USD$/, "-usd").toLowerCase();
  }

  useEffect(() => {
    async function getPositions() {
      try {
        const response = await fetch("/api/positions?fund=" + fundID, {
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

  // Dependencies should include anything that's used in this effect and can change.
  // Function to format percentage
  const formatPercentage = (value) => {
    return `${(parseFloat(value) * 100).toFixed(2)}%`;
  };

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
    <div className="rounded-sm w-96 h-80 backdrop-blur-xl">
      <div className="relative rounded-sm">
        <div className="bg-[#121212] rounded-sm">
          <div className="border-b border-cyan-400 px-2">
            <div className="grid grid-cols-2 px-1 py-2">
              <p className="text-amber-100 font-light">Portfolio</p>
              <button className="text-amber-100 justify-self-end px-2 text-sm font-extralight">
                Filter
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="overflow-auto h-80">
            {positions?.map((position) => (
              <div
                key={position.asset_id}
                className="grid grid-cols-3 bg-[#121212] space-y-2 px-1"
              >
                <div className="pt-3 pl-1">
                  <div className="place-self-start text-sm text-white">
                    {position.symbol}
                  </div>
                  <div className="place-self-start text-sm text-white">
                    # of Shares: {position.shares}
                  </div>
                  
                </div>

                <WatchlistSmallDayChart symbol={position.symbol} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
