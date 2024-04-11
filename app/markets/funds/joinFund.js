"use client";

import { useContext, useState, useEffect } from "react";
import UserContext from "../../UserContext";
import FundDeposit from "./fundDeposit";
import useFetch from "../../hooks/useFetch";

export default function JoinFund({
  symbol,
  members,
  requests,
  fundID,
  inJournals,
  completedJournals,
}) {
  const { user } = useContext(UserContext);

  const [thisFundID, setThisFundID] = useState(fundID);

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [memberStatus, setMemberStatus] = useState(0); // 0: not a member, 1: member, 2: requested to join
  const [userTransfers, setUserTransfers] = useState([]);
  const [inquiry, setInquiry] = useState("");

  useEffect(() => {
    const completedByUser = completedJournals.filter(
      (journal) => journal.user === user?.accountID
    );
    setUserTransfers(completedByUser);

    if (members?.includes(user?.accountID)) {
      setMemberStatus(1);
    } else if (requests.some((request) => request.user === user?.accountID)) {
      setMemberStatus(2);
    }
  }, [user, members, requests, completedJournals]);

  const requestJoin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setAlert({ message: "Sending request", type: "info" });

    try {
      const response = await fetch("/api/fund/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "request", fundID, inquiry }),
      });
      const data = await response.json();

      if (data.status === "success") {
        setAlert({ message: "Request sent!", type: "success" });
      } else {
        setAlert({
          message: "Request failed! Try again later...",
          type: "error",
        });
      }
    } catch (error) {
      setAlert({ message: "Error occurred!", type: "error" });
    }

    setIsLoading(false);
    setTimeout(() => setAlert({ message: "", type: "" }), 3000);
  };

  return (
    <div>
      {memberStatus == 1 && (
        <div className="justify-self-end pr-10 max-w-2xl pb-14">
          <FundDeposit fundID={fundID} />
        </div>
      )}
      <div className="join-fund-card">
        <div className="card-header">
          <p className="card-title borber-b border-cyan-400 py-1">
            {memberStatus === 0 && `Request to join ${symbol}`}
            {memberStatus === 1 && `Your investments for ${symbol}`}
            {memberStatus === 2 && `Join request`}
          </p>
        </div>

        {memberStatus === 0 && (
          <RequestForm
            isLoading={isLoading}
            inquiry={inquiry}
            setInquiry={setInquiry}
            requestJoin={requestJoin}
          />
        )}
        {memberStatus === 1 && (
          <InvestmentList fundID={fundID} transfers={userTransfers} />
        )}
        {memberStatus === 2 && <PendingRequest symbol={symbol} />}
      </div>

      {alert.message && <Alert message={alert.message} type={alert.type} />}
    </div>
  );
}

function RequestForm({ isLoading, inquiry, setInquiry, requestJoin, fundID }) {
  return (
    <>
      <div className="flex flex-col">
        <textarea
          value={inquiry}
          onChange={(e) => setInquiry(e.target.value)}
          className="textarea"
          placeholder="Enter your inquiry here..."
        ></textarea>
        <button onClick={requestJoin} className="btn" disabled={isLoading}>
          {isLoading ? "Sending Request..." : "Request to join"}
        </button>
      </div>
    </>
  );
}

function InvestmentList({ transfers, fundID }) {
  return (
    <>
      <div className="investment-list">
        {transfers.map((transfer) => (
          <div key={transfer.id} className="text-center p-2 rounded-md bg-slate-200 text-black py-2">
            <p className="amount">${transfer.amount}</p>
            <p className="date text-xs">{new Date(transfer.time).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function PendingRequest({ symbol }) {
  return (
    <p className="pending-request">Your request to join {symbol} is pending.</p>
  );
}

function Alert({ message, type }) {
  return (
    <div
      className={`toast toast-center rounded-sm pb-20 top-toast ${
        type === "error" ? "alert-error" : "alert-success"
      }`}
    >
      <div className={`alert ${type}`}>
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
            d={
              type === "error"
                ? "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            }
          />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
}
