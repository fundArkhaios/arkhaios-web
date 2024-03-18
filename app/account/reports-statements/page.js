'use client'

import UserContext from "../../UserContext"
import NotVerifiedAlert from "../../components/notVerifiedAlert";
import ReportsTable from "./reportsTable";
import { useContext } from "react";

export default function Page() {

  const user = useContext(UserContext);

  return (
    <div className = "py-5">
    {user.kycVerified ? <ReportsTable/> : <NotVerifiedAlert/>}      
    </div>
  )

}