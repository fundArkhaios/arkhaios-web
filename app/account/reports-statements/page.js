'use client'

import UserContext from "../../UserContext"
import NotVerifiedAlert from "../../components/notVerifiedAlert";
import ReportsTable from "./reportsTable";
import { useContext } from "react";

export default function Page() {

  const user = useContext(UserContext);

  return (
    <>
    {user.kycVerified ? <ReportsTable/> : <NotVerifiedAlert/>}      
    </>



  )

}