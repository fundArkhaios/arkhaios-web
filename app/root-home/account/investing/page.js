"use client";

import UserContext from "../../UserContext";
import NotVerifiedAlert from "../../components/notVerifiedAlert";
import { useContext } from "react";

export default function Page() {
  const { user } = useContext(UserContext);
  console.log(user);
  return (
    <div className="py-5">
      {user.kycVerified ? <></> : <NotVerifiedAlert />}
    </div>
  );
}
