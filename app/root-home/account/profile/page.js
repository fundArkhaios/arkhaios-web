"use client";
import UserContext from "../../UserContext.js";
import { useContext } from "react";
import Link from "next/link";
import NotVerifiedAlert from "../../components/notVerifiedAlert.js";
import DisplayProfile from "./displayProfile.js";

export default function Page() {
  const { user } = useContext(UserContext);
    
  return (
    <div className = "py-5 grid">
      {/* <div className="text-center">Profile Page</div> */}
      {!user.kycVerified ? (
        <NotVerifiedAlert/>
      ) : (
        <DisplayProfile user = {user}/>
      )}
    </div>
  );
}
