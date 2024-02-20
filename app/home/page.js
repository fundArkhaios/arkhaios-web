"use client";
// import UserChart from "./userChart";
import Header from "../header.js";
import "./userChart";

import UserContext from "../UserContext.js";
import { useContext } from "react";
import NotVerifiedAlert from "../components/notVerifiedAlert.js";
import UnverfiedHomeChart from "./unverifiedHomeChart.js";
import AssetView from "./AssetView.js";
import VerifiedHomeChart from "./verifiedHomeChart.js";

export default function Page() {
  const { user } = useContext(UserContext);

  return (
    <>
      <main className="p-5 border-b border-amber-100">
        {/* <MainChart/> */}
        {!user.kycVerified ? <NotVerifiedAlert /> : <></>}
        <div className="grid grid-cols-3 p-5 justify-items-stretch">
          <div className="justify-self-start pr-5 rounded-sm w-72">
            {!user.kycVerified ? <></> : <AssetView />}
          </div>
          <div className="grid space-y-15 max-w-[3/4] justify-self-center">
            {!user.kycVerified ? (
              <UnverfiedHomeChart user={user} />
            ) : (
              <VerifiedHomeChart user={user} />
            )}
          </div>
          <div className="justify-self-end pl-5 pr-3 rounded-sm">
            {!user.kycVerified ? <></> : <AssetView />}
          </div>
        </div>
      </main>
      <main className="p-10 interBold text-3xl text-white">NEWS</main>
    </>
  );
}
