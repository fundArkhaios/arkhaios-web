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
import UnverifiedAssetView from "./unverifiedAssetView.js";
import Watchlist from "./watchlist.js";
import UnverifiedWatchlist from "./unverifiedWatchlist.js";
import MarketNews from "./marketNews.js";
import Orders from "./Orders.js";

export default function Page() {
  const { user } = useContext(UserContext);

  return (
    <>
      <main className="flex flex-wrap justify-center p-5 border-b border-amber-100">
        {!user.kycVerified ? (
          <div className="flex justify-center px-64">
            <NotVerifiedAlert />
          </div>
        ) : (
          <></>
        )}

        <div className="shrink flex flex-wrap py-4 px-3 justify-items-center">
          <div className="justify-self-start rounded-sm">
            {!user.kycVerified ? <UnverifiedAssetView /> : <AssetView />}
          </div>
          <div className="shrink grid max-w-[3/4] px-5  justify-self-center">
            {!user.kycVerified ? (
              <UnverfiedHomeChart user={user} />
            ) : (
              <VerifiedHomeChart user={user} />
            )}
          </div>
          <div className="justify-self-end pl-5 rounded-sm">
            {user.kycVerified ? <Watchlist /> : <UnverifiedWatchlist />}
          </div>
        </div>
      </main>
      <main>
        <h1 className="pl-10 pt-10 interBold text-3xl text-white">NEWS</h1>
        <div className="flex space-between">
          <MarketNews />
          <Orders />
        </div>
      </main>
    </>
  );
}
