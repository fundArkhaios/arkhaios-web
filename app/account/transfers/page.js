"use client";
import { useContext } from "react";
import UserContext from "../../UserContext";
import NotVerifiedAlert from "../../components/notVerifiedAlert";
import PlaidLinkComponent from "./PlaidLinkComponent";
import PlaidTransfer from "./PlaidTransfer";

export default function Page() {
  const { user } = useContext(UserContext);

  return (
    <div className="py-5">
      {user.kycVerified ? <></> : <NotVerifiedAlert />}
      <div className="p-10">
        {" "}
        {user.kycVerified ? <PlaidLinkComponent /> : <></>}
      </div>
    </div>
  );
}
