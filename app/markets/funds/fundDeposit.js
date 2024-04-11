"use client";
import { useContext, useState, useEffect } from "react";
import UserContext from "../../UserContext";
import useFetch from "../../hooks/useFetch";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline"

export default function FundDeposit ({fundID}) {
    const [alert, setAlert] = useState([]);

    const deposit = async function() {
        try {
            setAlert(["Initiating deposit...", "success"])

            if(!document.getElementById("deposit-amount").value) {
                setAlert(["Please select a deposit amount", "error"]);
                setTimeout(() => setAlert([]), 3000);
                return;
            }

            const response = await fetch("/api/fund/invest", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fundID: fundID,
                    amount: document.getElementById("deposit-amount").value,
                })
            });

            const data = await response.json();

            if(data.status == "success") {
                setAlert(["Deposit initiated!", "success"])
                setTimeout(() => setAlert([]), 3000);
            } else {
                setAlert(["Deposit failed! Try again...", "error"])
                setTimeout(() => setAlert([]), 3000);
            }
        } catch(e) {
            setAlert(["Deposit failed! Try again...", "error"])
            setTimeout(() => setAlert([]), 3000);
        }
    }

    return (
    <div className="w-full border-slate-300">
        <div className="items-center justify-between gap-3 m-2 border-slate-300">
            <label className="label" htmlFor="symbol">
                <span className="label-text">Deposit to Fund</span>
            </label>
            <input
                type="text"
                placeholder="Enter a deposit amount"
                className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
                required
                id="deposit-amount"
            />

            <button onClick={() => deposit()} className="btn flex flex-row justify-self-center">
                <p>Deposit</p>
                <PaperAirplaneIcon className="w-3 h-3"/>
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
    </div>);
}