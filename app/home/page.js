'use client'
// import UserChart from "./userChart";
import Header from "../header.js"
import './userChart'
import MainChart from './mainChart.js'
import UserContext from "../UserContext.js";

import { useContext } from 'react';

export default function Home() {

    const {user} = useContext(UserContext);
    // console.log(value)
    return(
        
        <main>            
            <MainChart/>
            <div>{user.firstName}</div>
        </main>

    );
}