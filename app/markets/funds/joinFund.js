"use client";
import { useContext, useState, useEffect } from "react";
import UserContext from "../../UserContext";
import useFetch from "../../hooks/useFetch";

export default function JoinFund({ symbol, fundID }) {
  const [loading, setLoading] = useState();
  const [alert, setAlert] = useState([]);

  async function requestJoin(event) {
    setLoading(true);
    event?.preventDefault();

    setAlert(["Sending request", "success"])

    await fetch("/api/fund/join", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "request",
        fundID: fundID,
        inquiry: document.getElementById("inquiry").value
      }),
    }).then(async (response) => {
        const data = await response.json();
        if (data.status == "success") {
          setAlert(["Request sent!", "success"])
          setTimeout(() => setAlert([]), 3000);
        } else {
          setAlert(["Request failed! Try again later...", "error"])
          setTimeout(() => setAlert([]), 3000);
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
              Request to join {symbol}
            </p>
          </div>
        </div>

        <textarea id="inquiry" className="block mt-1 m-auto text-center textarea textarea-bordered h-64" placeholder="Enter your inquiry here..."></textarea>

        <button
          onClick={requestJoin}
          className={`w-full mt-4 mb-2 p-2 text-white btn`}
          disabled={loading}
        >
          {loading ? "Sending Request..." : "Request to join"}
        </button>
        
      </div>

      {alert?.[1] == 'error' ? (
          <div className="toast toast-center rounded-sm pb-20 top-toast">
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
              <span>{alert?.[0]}</span>
            </div>
          </div>
        ) : (
          <></>
        )}

        {alert?.[1] == 'success' ? (
          <div className="toast toast-center rounded-sm pb-20 top-toast">
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
              <span>{alert?.[0]}</span>
            </div>
          </div>
        ) : (
          <></>
        )}
    </div>
  );
}