"use client";

import UserContext from "../../UserContext";
import NotVerifiedAlert from "../../components/notVerifiedAlert";
import { useContext } from "react";
import PlaidLinkComponent from "./PlaidLinkComponent";
import PlaidTransfer from "./PlaidTransfer";
export default function Page() {
  const { user } = useContext(UserContext);
  console.log(user);
  return (
    <div className="py-5">
      {user.kycVerified ? <></> : <NotVerifiedAlert />}
      <div className="p-10">
        {" "}
        {user.kycVerified ? <PlaidLinkComponent /> : <></>}
      </div>
      <div className="p-10">
        {" "}
        {user.plaidAccess ? <PlaidTransfer /> : <>No Bank Account</>}
      </div>
    </div>
  );
}
