'use client'
import UserContext from "../../UserContext";
import { useContext, useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";


export default function PlaceStockOrder ({symbol}) {

  const { user } = useContext(UserContext);

  const {isLoading, error, responseJSON} = useFetch("/api/positions?symbol=" + symbol)

  const [position, setPosition] = useState({})


  useEffect( () => {
    if (responseJSON) {
      console.log("ResponseJSON.data: " + responseJSON.data)
      setPosition(responseJSON.data)
    }

  }, [isLoading]) 

  console.log("ResponseJSON: " + responseJSON);

  return (
    <div>
      <div className="w-72 h-96 rounded-sm border border-gray-300 ">
        <div className="border-b border-amber-200 px-2">
          <div className="grid grid-cols-2 px-1 py-2">
            <p className="text-amber-100 font-light">Trade {symbol.toUpperCase()}</p>
          </div>
        </div>
        <div className = "grid grid-cols-2 w-auto">
        <p className = "px-2 py-1">Shares Owned: </p>
        <p className = "justify-end">{position.qty}</p>
        </div>
        
        <p className = "px-2">Total Amount: </p>
      </div>
    </div>
  );
}
