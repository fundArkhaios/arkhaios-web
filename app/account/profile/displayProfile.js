import useFetch from "../../hooks/useFetch";
import { useEffect, useState } from 'react'
export default function DisplayProfile({ user }) {
  const [ userData, setUserData ] = useState({});

  const { responseJSON, isLoading, error } = useFetch(
    "/api/account/trading"
  );

  useEffect(() => {
    if(responseJSON) {
      setUserData(responseJSON.data);
    }
  }, [isLoading]);

  const payload = {
    balance: userData?.cash || "0",
    purchasing_power: userData?.buying_power || "0",
    daytrades_made: userData?.daytrade_count,
  };

  return (
    <div className = "py-10 px-10 space-y-5">
      <div className="justify-start">
        <div className="justify-start">Balance</div>
        <p className="text-5xl">{payload.balance}</p>
      </div>
      <div className = "justify-self-start">
        <p>Purchasing Power</p>
        <p className="text-5xl">{payload.purchasing_power}</p>
      </div>
      <div className = "justify-self-start">
        <p>Day Trade Count</p>
        <p className="text-5xl">{payload.daytrades_made}</p>
      </div>
    </div>
  );
}
