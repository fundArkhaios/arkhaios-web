"use client";
import { useContext, useState, useEffect } from "react";
import UserContext from "../../UserContext";
import useFetch from "../../hooks/useFetch";

export default function PlaceStockOrder({ symbol }) {
  const { user } = useContext(UserContext);

  const [orderType, setOrderType] = useState("Limit Order");
  const [buyIn, setBuyIn] = useState("Shares");
  const [limitPrice, setLimitPrice] = useState();
  const [shares, setShares] = useState("");
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState();
  const [orderFailed, setOrderFailed] = useState();
  const [symbolPrice, setSymbolPrice] = useState();
  const [loading, setLoading] = useState();
  const [side, setSide] = useState("buy");

  const { isLoading, error, responseJSON } = useFetch(
    "/api/quote?id=" + symbol
  );
  console.log("Side: " + side);
  useEffect(() => {
    if (responseJSON && responseJSON.data) {
      setSymbolPrice(responseJSON.data.price);
    }
  }, [responseJSON, isLoading]);

  console.log("symbol price: " + symbolPrice);

  async function placeStockOrder(event) {
    setLoading(true);
    event.preventDefault();

    const type = orderType === "Limit Order" ? "limit" : "market";
    var transaction;
    if (buyIn == "Shares") {
      transaction = "shares";
    }

    let payload = {
      symbol: symbol,
      type: type,
      side: side, // use the side state directly
      qty: shares, // assuming qty should be set to shares
      transaction: transaction
    };

    // Add price only for limit orders
    if (type === "limit") {
      payload.price = limitPrice;
    }

    if (buyIn === "Shares") {
      payload.transaction = "shares";
    } else {
      payload.notional = shares; // assuming notional should be set when 'Dollar' is selected
    }

    await fetch("/api/place-order", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const data = await response.json();
        if (data.status == "success") {
          setOrderPlacedSuccess(true);
        } else {
          setOrderFailed(true);
        }
        setLoading(false);
      })
      .catch((error) => {});
  }

  return (
    <div>
      <div className="w-72 h-96 rounded-sm border border-slate-600 sticky">
        <div className="border-b border-amber-200 px-2">
          <div className="grid grid-cols-2 px-1 py-2">
            <p className="text-amber-100 font-light">
              Send Inquiry
            </p>
          </div>
        </div>

        <textarea className="block mt-1 m-auto text-center textarea textarea-bordered h-64" placeholder="Enter your inquiry here..."></textarea>

        <button
          onClick={placeStockOrder}
          className={`w-full mt-4 p-2 text-white btn`}
          disabled={loading}
        >
          {loading ? "Sending Inquiry..." : "Send Inquiry"}
        </button>

        {orderFailed && (
          <p className="text-red-500">
            Failed to send inquiry. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}