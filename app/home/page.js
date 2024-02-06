"use client";
// import UserChart from "./userChart";
import Header from "../header.js";
import "./userChart";
import MainChart from "./mainChart.js";
import UserContext from "../UserContext.js";
import { useContext } from "react";
import NotVerifiedAlert from "../components/notVerifiedAlert.js";
import UnverfiedHomeChart from "./unverifiedHomeChart.js";

export default function Page() {
  const { user } = useContext(UserContext);

  return (
    <>
    <main className="grid grid-cols-2 p-10 border-b border-amber-100">
      {/* <MainChart/> */}
      <div className="grid space-y-15 max-w-[1/2]">
        
        {!user.kyc ? <NotVerifiedAlert /> : <></>}
        {!user.kyc ? <UnverfiedHomeChart user={user} /> : <></>}
      </div>
      <div className ="text-center">
        Your Stocks
        <div>AAPL</div>
        <div>NFLX</div>
      </div>
    </main>
    <main className ="p-10 interBold text-3xl text-white">
        NEWS
    </main>
    </>
  );
}
