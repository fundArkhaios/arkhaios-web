'use client'

import useFetch from "../hooks/useFetch";
import { useEffect, useState } from 'react';


export default function TopLeft({ fund }) {
  
/* 
    const { error, isLoading, responseJSON } = useFetch(
        "/api/fund/history?symbol=" + fundSymbol + "&period=1m"
      );

    useEffect( () => {
        if (responseJSON) {

        }   

    }, [isLoading])
 */

    console.log(fund);

  
return (
    <div className="self-center">
      <div className=" grid grid-rows-2 grid-cols-3 place-self-center place-content-center gap-16">
        <div className="col-span-1">
          <p className="text-5xl font-bold">$271K</p>
          <p className="text-xs font-thin">AUM</p>
        </div>
        <div className="col-span-1">
          <p className="text-5xl font-bold">14%</p>
          <p className="text-xs font-thin">Percent Change</p>
        </div>
        <div className="col-span-1">
          <p className="text-5xl font-bold">{fund.members.length}</p>
          <p className="text-xs font-thin"># of Investors</p>
        </div>
        <div className="col-span-1">
          <p className="text-5xl font-bold">1</p>
          <p className="text-xs font-thin"># of Portfolio Managers</p>
        </div>
        <div className="col-span-1">
          <p className="text-5xl font-bold">1d 42m 54s</p>
          <p className="text-xs font-thin">Time until distribution.</p>
        </div>
        <div className="col-span-1">
          <p className="text-5xl font-bold">Inactive</p>
          <p className="text-xs font-thin">Fund Status</p>
        </div>
      </div>
    </div>
  );
}
