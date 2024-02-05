'use client'
import { useContext } from "react"
import UserContext from "../../UserContext"
import NotVerifiedAlert from "../../components/notVerifiedAlert";
export default function Page() {

    const { user } = useContext(UserContext);

    return (
        <div className = "py-5">
            { !user.kyc ? <NotVerifiedAlert/> : <></>

            }
        </div>
        
    )
}