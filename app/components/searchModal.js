import "./components.css";
import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";

export default function SearchModal() {
  const [searchInput, setSearchInput] = useState("");

  const [response, setResponse] = useState([{ id: "0" }]);

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };


  const { error, isLoading, responseJSON } = useFetch(
    "/api/search?query=" + searchInput
  );

  useEffect(() => {
    if (responseJSON != null) {
      setResponse(responseJSON.data);
    }
  }, [isLoading, responseJSON]);

  return (
    <>
      <div className="container-input text-white">
        <svg
          fill="white"
          width="20px"
          height="20px"
          viewBox="0 0 1920 1920"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z"
            fillRule="nonzero"
          ></path>
        </svg>
        <input
          type="text"
          placeholder="Search Stocks, Futures, Funds, Crypto"
          name="text"
          className="text-white searchInput px-10 interFont text-sm"
          value={searchInput}
          onChange={handleInputChange}
        />
      </div>
      {response?.map((asset) => (
        <div key={asset.id} className="py-2">
          <div className="grid grid-cols-3 ">
            <div className="hover:bg-slate-500 rounded-sm">
              <div className="flex flex-row"></div>
              <div className="font-light text-sm">{asset.symbol}</div>
              <div className="font-thin text-sm">{asset.exchange}</div>
            </div>
            <div className="font-bold">{asset.name}</div>
          </div>
        </div>
      ))}
    </>
  );
}
