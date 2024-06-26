"use client";

import { useEffect, useState } from "react";

export default function FundOrders({ fundID }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function getOrders() {
      try {
        const response = await fetch("/api/orders?fund=" + fundID, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setOrders(data.data);
      } catch (error) {
        console.error(error);
      }
    }

    getOrders();
  }, []);

  return (
    <div className="rounded-sm max-w-5xl mx-auto backdrop-blur-xl bg-[#121212]">
      <div className="relative rounded-sm bg-[#121212]">
        <div className="bg-[#121212] rounded-sm">
          <div className="border-b border-cyan-400 px-2">
            <div className="grid grid-cols-2 px-1 py-2">
              <p className="text-amber-100 font-light">Order History</p>
              <button className="text-amber-100 justify-self-end px-2 text-sm font-extralight">
                Filter
              </button>
            </div>
          </div>
          <div className="overflow-auto ">
            {orders?.map((order) => (
              <>
                <div
                  key={order.asset_id}
                  className="grid grid-cols-3 bg-[#121212] space-y-2 px-1"
                >
                  <div className="pt-3 pl-1">
                    <div className="place-self-center text-sm text-white">
                      {order.symbol}
                    </div>
                    <div className="text-xs text-slate-300 font-extralight">
                      {order.asset_class}
                    </div>
                  </div>

                  <div className="px-2 pl-2 pt-1 ">
                    <p className="text-right font-sm text-white">
                      {order.order_type == "market"
                        ? order.filled_avg_price
                          ? `$${order.filled_avg_price}`
                          : "Market Price"
                        : `$${order.limit_price}`}
                    </p>

                    <p className="text-right text-xs text-slate-300">
                      Filled: {order.filled_qty}/{order.qty || order.notional}{" "}
                      {order.qty ? "shares" : "dollars"}
                    </p>

                    <p className="text-right text-xs text-slate-300">
                      {order.order_type == "market" ? "Market" : "Limit"} order
                    </p>
                  </div>

                  <div className="px-2 pl-2 pt-1">
                    <p className="text-thin text-xs text-slate-300 text-right">
                      Status: {order.status}
                    </p>
                    <p className="text-thin text-xs text-slate-300 text-right">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
