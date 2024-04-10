"use client";
import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import useFetch from "../hooks/useFetch";

export default function TopRight({ fundSymbol, fundAvailableBalance, fundID }) {
  const { error, isLoading, responseJSON } = useFetch(
    "/api/fund/history?symbol=" + fundSymbol + "&period=1m"
  );

  // Assuming 'fund' should be 'fundID' based on your props
  const { error: positionsError, isLoading: positionsIsLoading, responseJSON: positionsResponseJSON } = useFetch("/api/positions?fund=" + fundID);

  const [positionsData, setPositionsData] = useState({
    labels: [],
    datasets: [{
      label: 'Positions',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1
    }]
  });

  useEffect(() => {
    if (positionsResponseJSON && positionsResponseJSON.data) {
      const positionEntries = Object.entries(positionsResponseJSON.data);
      const labels = positionEntries.map(([symbol, _]) => symbol);
      const data = positionEntries.map(([_, positionData]) => positionData.shares);
      const backgroundColors = positionEntries.map((_, index) => `rgba(${255 - index * 50}, ${99 + index * 50}, 132, 0.6)`);
      const borderColors = positionEntries.map((_, index) => `rgba(${255 - index * 50}, ${99 + index * 50}, 132, 1)`);

      setPositionsData({
        labels,
        datasets: [{
          label: 'Positions',
          data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      });
    }
  }, [positionsIsLoading]);

  const [everythingBalance, setEverythingBalance] = useState(0);
  const [equity, setEquity] = useState(0);
  const [balances, setBalances] = useState(true);

  useEffect(() => {
    if (responseJSON && responseJSON.value) {
      const lastValue = responseJSON.value[responseJSON.value.length - 1];
      setEverythingBalance(lastValue);
      setEquity(lastValue - fundAvailableBalance);
    }
  }, [isLoading]);

  ChartJS.register(ArcElement, Tooltip, Legend);
  const data = {
    labels: ["Equity", "Cash"],
    datasets: [
      {
        label: "Portfolio Composition",
        data: [equity, fundAvailableBalance],
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const handleBalancesClick = () => setBalances(true);
  const handlePositionsClick = () => setBalances(false);

  return (
    <>
      <div className="text-center grid grid-cols-2 pb-2">
        <button onClick={handleBalancesClick} className="hover:underline">Balances</button>
        <button onClick={handlePositionsClick} className="hover:underline">Positions</button>
      </div>
      {balances ? <Doughnut data={data} /> : <Doughnut data={positionsData} />}
    </>
  );
}