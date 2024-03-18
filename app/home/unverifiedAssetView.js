import { useEffect, useRef, useState } from "react";
import { ColorType, createChart, CrosshairMode } from "lightweight-charts";
import SmallDayChart from "./smallDayChart";

export default function UnverifiedAssetView({ user }) {
  const [positions, setPositions] = useState([]);


  /* function changeToCrypto(symbol) {
    return symbol.replace(/USD$/, '-usd').toLowerCase();
  } */

  // Dependencies should include anything that's used in this effect and can change.
  // Function to format percentage
  const formatPercentage = (value) => {
    return `${(parseFloat(value) * 100).toFixed(2)}%`;
  };

  return (
    <div className="rounded-sm w-80 backdrop-blur-xl border-white">
      <div className="relative rounded-sm">
        <div className="bg-[#121212] border border-slate-600 rounded-sm">
          <div className="border-b border-slate-600 px-2">
            <div className="grid grid-cols-2 px-1 py-2">
              <p className="text-amber-100 font-light">Portfolio</p>
              <button className="text-amber-100 justify-self-end px-2 text-sm font-extralight">
                Filter
              </button>
            </div>
          </div>
          <div className="overflow-auto h-80 text-center self-center">
            <p className = "text-sm font-light pt-20">No assets</p>
          </div>
        </div>
      </div>
    </div>
  );
}
