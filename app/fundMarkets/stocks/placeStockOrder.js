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
  const [dollars, setDollars] = useState();
  const [marketPrice, setMarketPrice] = useState();
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState();
  const [orderFailed, setOrderFailed] = useState();
  const [failedMessage, setFailedMessage] = useState();
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

    let transaction = "";
    if (buyIn == "Shares") {
      transaction = "shares";
    }

    let payload = {
      fund: user.fundsManaging[0],
      symbol: symbol,
      type: type,
      side: side, // use the side state directly
      qty: buyIn == "Shares" ? shares : dollars, // assuming qty should be set to shares
      transaction: buyIn == "Shares" ? "shares" : "dollars",
    };

    // Add price only for limit orders
    if (type === "limit") {
      payload.price = limitPrice;
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
          setFailedMessage("");
          setOrderFailed(false);
          setOrderPlacedSuccess(true);
        } else {
          setOrderFailed(true);
          setOrderPlacedSuccess(false);
          setFailedMessage(data.message);
        }
        setLoading(false);
      })
      .catch((error) => {});
  }

  const selectOrderType = () => {
    return (
      <div className="grid grid-cols-2 px-4 py-2">
        <label htmlFor="orderType" className="block text-sm font-medium">
          Order Type:
        </label>
        <select
          id="orderType"
          name="orderType"
          className="mt-1 bg-[#141517] block w-full text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={orderType}
          onChange={(e) => setOrderType(e.target.value)}
        >
          <option value="Limit Order">Limit Order</option>
          <option value="Market Order">Market Order</option>
        </select>
      </div>
    );
  };

  useEffect(() => {
    let timer;
    if (orderPlacedSuccess) {
      timer = setTimeout(() => setOrderPlacedSuccess(false), 5000);
    }

    // Cleanup function
    return () => clearTimeout(timer);
  }, [orderPlacedSuccess]);

  const OrderPlacedToast = () => {
    return (
      <div className="toast toast-center rounded-sm pb-20">
        <div className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Order Placed Successfully!</span>
          <span></span>
        </div>
      </div>
    );
  };

  useEffect( () => {
    let timer;
    if (orderFailed) {
      timer = setTimeout( () => setOrderFailed(false), 5000);
    }
    return () => clearTimeout(timer);

  }, [orderFailed])



  const OrderFailedToast = () => {
    return (
      <div className="toast toast-center rounded-sm pb-20">
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Failed to place order: {failedMessage}</span>
          <span></span>
        </div>
      </div>
    );
  };

  const selectBuyIn = () => {
    return (
      <div className="grid grid-cols-2 px-4 py-2">
        <label htmlFor="orderType" className="block text-sm font-medium">
          Buy In:
        </label>
        <select
          id="buyIn"
          name="buyIn"
          className="mt-1 bg-[#141517] block w-full text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={buyIn}
          onChange={(e) => setBuyIn(e.target.value)}
        >
          <option value="Shares">Shares</option>
          <option value="Dollar">Dollar</option>
        </select>
      </div>
    );
  };

  const chooseSide = () => {
    return (
      <div className="text-center top-2">
        <div className="join p-2 self-center">
          <input
            type="radio"
            name="buySide"
            value="buy"
            onChange={(e) => setSide(e.target.value)}
            checked={side === "buy"}
            className="btn join-item btn-md"
            aria-label="BUY"
          />

          <input
            type="radio"
            name="sellSide"
            value="sell"
            onChange={(e) => setSide(e.target.value)}
            checked={side === "sell"}
            aria-label="SELL"
            className="btn join-item btn-md"
          />
        </div>
      </div>
    );
  };

  const validateNumericInput = (value) => {
    // Allow numbers with up to two decimal places
    const regex = /^\d*\.?\d{0,2}$/;

    // If the value is empty, a single decimal point, or a valid number, return it
    if (value === "" || value === "." || regex.test(value)) {
      return value;
    }

    // If the value ends with a decimal point followed by more than two digits, truncate it to two digits
    const match = value.match(/^\d+\.\d{3,}/);
    if (match) {
      return match[0].slice(0, -1); // Return the number truncated to two decimal places
    }

    // If the input doesn't match the regex, return the last valid value
    return value.slice(0, -1);
  };

  return (
    <div>
      <div className="w-72 h-96 rounded-sm border border-gray-600 sticky bg-[#101012]">
        <div className="border-b border-amber-200 px-2">
          <div className="grid grid-cols-2 px-1 py-2">
            <p className="text-amber-100 font-light">
              Trade {symbol.toUpperCase()}
            </p>
          </div>
        </div>
        <>
          {selectOrderType()}
          {selectBuyIn()}
          {orderType === "Limit Order" ? (
            buyIn === "Shares" ? (
              <>
                <div className="px-4 py-2">
                  <label
                    htmlFor="limitPrice"
                    className="block text-sm font-medium text-white"
                  >
                    Limit Price
                  </label>
                  <input
                    type="text"
                    name="limitPrice"
                    id="limitPrice"
                    value={limitPrice}
                    onChange={(e) =>
                      setLimitPrice(validateNumericInput(e.target.value))
                    }
                    className="mt-1 input input-sm bg-[#141517] block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  />
                </div>
                <div className="px-4 py-2">
                  <label
                    htmlFor="shares"
                    className="block text-sm font-medium text-white"
                  >
                    Shares
                  </label>
                  <input
                    type="text"
                    name="shares"
                    id="shares"
                    value={shares}
                    onChange={(e) =>
                      setShares(validateNumericInput(e.target.value))
                    }
                    className="mt-1 input input-sm bg-[#141517] block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  />
                </div>
                <div className="px-4 py-2">
                  <label
                    htmlFor="purchasePrice"
                    className="block text-sm font-medium text-white"
                  >
                    Price
                  </label>
                  <div>{"$" + symbolPrice * Number(shares).toFixed(2)}</div>
                </div>
              </>
            ) : (
              <>
                <div className="px-4 py-2">
                  <label
                    htmlFor="limitPrice"
                    className="block text-sm font-medium text-white"
                  >
                    Limit Price
                  </label>
                  <input
                    type="text"
                    name="limitPrice"
                    id="limitPrice"
                    value={limitPrice}
                    onChange={(e) =>
                      setLimitPrice(validateNumericInput(e.target.value))
                    }
                    className="mt-1 input input-sm bg-[#141517] block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  />
                </div>
                <div className="px-4 py-2">
                  <label
                    htmlFor="shares"
                    className="block text-sm font-medium text-white"
                  >
                    Dollar
                  </label>
                  <input
                    type="text"
                    name="dollar"
                    id="dollar"
                    value={dollars}
                    onChange={(e) =>
                      setDollars(validateNumericInput(e.target.value))
                    }
                    className="mt-1 input input-sm bg-[#141517] block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  />
                  <div className="py-2">
                    <label
                      htmlFor="Shares"
                      className="block text-sm font-medium text-white"
                    >
                      Shares
                    </label>
                    <div>
                      {Number(Number(dollars).toFixed(2) / symbolPrice).toFixed(
                        2
                      )}
                    </div>
                  </div>
                </div>
              </>
            )
          ) : buyIn === "Shares" ? (
            <>
              <div className="px-4 py-2">
                <label
                  htmlFor="shares"
                  className="block text-sm font-medium text-white"
                >
                  Shares
                </label>
                <input
                  type="text"
                  name="shares"
                  id="shares"
                  value={shares}
                  onChange={(e) =>
                    setShares(validateNumericInput(e.target.value))
                  }
                  className="mt-1 input input-sm bg-[#141517] block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                />
              </div>
              <div className="px-4 py-2">
                <label
                  htmlFor="purchasePrice"
                  className="block text-sm font-medium text-white"
                >
                  Price
                </label>
                <div>{"$" + symbolPrice * Number(shares).toFixed(2)}</div>
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-2">
                <label
                  htmlFor="dollar"
                  className="block text-sm font-medium text-white"
                >
                  Dollar Amount
                </label>
                <input
                  type=""
                  name="dollars"
                  id="dollars"
                  value={dollars}
                  onChange={(e) =>
                    setDollars(validateNumericInput(e.target.value))
                  }
                  className="input input-sm mt-1 bg-[#141517] block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
                />
              </div>
              <div className="px-4 py-2">
                <label
                  htmlFor="Shares"
                  className="block text-sm font-medium text-white"
                >
                  Shares
                </label>
                <div>
                  {Number(Number(dollars).toFixed(2) / symbolPrice).toFixed(2)}
                </div>
              </div>
            </>
          )}

          {chooseSide()}
        </>
        <button
          onClick={placeStockOrder}
          className={`block w-full rounded-md mt-4 p-2 text-white font-bold ${
            orderPlacedSuccess ? "bg-green-500" : "bg-blue-500"
          }`}
          disabled={loading}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
      {orderPlacedSuccess ? <OrderPlacedToast /> : <></>}
      {orderFailed ? <OrderFailedToast/> : <></>}
    </div>
  );
}
