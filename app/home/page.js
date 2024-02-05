'use client'
// import UserChart from "./userChart";
import Header from "../header.js"
import './userChart'
import MainChart from './mainChart.js'
import UserContext from "../UserContext.js";
import { useContext } from 'react';

export default function Page() {

    const { user } = useContext(UserContext);

    return(
        
        <main>            
            {/* <MainChart/> */}
            <div>{user.firstName}</div>
        </main>

    );
}