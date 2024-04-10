"use client";

import { useEffect, useState } from "react";
import Link from 'next/link'
import useFetch from "../../hooks/useFetch";

export default function CompanyPeers({ symbol }) {
  const { error, isLoading, responseJSON } = useFetch(
    "/api/company-peers?symbol=" + symbol
  );

  const [companyPeers, setCompanyPeers] = useState([]);

  useEffect(() => {
    if (responseJSON) {
      setCompanyPeers(responseJSON.data);
    }
  }, [isLoading, responseJSON]);

  return (
    <div className="w-72 h-96">
      <div>
        <p className="text-center text-lg font-bold border-b border-yellow-100 ">
          Similar Companies
        </p>
        {companyPeers.map(
          (company, index) =>
            index > 0 && ( // Skip the first item (index 0)
              <div key={company} className="py-1 px-1 hover:underline">
                <Link href={`/markets/stocks/` + company}>
                  <p className="text-center font-light">{company}</p>
                </Link>
              </div>
            )
        )}
      </div>
    </div>
  );
}
