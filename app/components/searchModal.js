import { useRouter } from "next/navigation";
import "./components.css";
import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import Link from "next/link";
import useDebounce from "../hooks/useDebounce";
export default function SearchModal({ onClose, isOpen }) {

  const [searchInput, setSearchInput] = useState();
  const router = useRouter();
  const [response, setResponse] = useState([{ id: "0" }]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const debouncedValue = useDebounce(searchInput, 400);
  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const { error, isLoading, responseJSON } = useFetch(
    "/api/search?query=" + debouncedValue
  );

  useEffect(() => {
    if (responseJSON != null && responseJSON.data) {
      setResponse(responseJSON.data || [{}]);
    }
  }, [isLoading, responseJSON]);

  const highlightMatch = (text, searchInput) => {
    
    if (!searchInput) {
      return text;
    }

    if (text) {
      const regex = new RegExp(`(${searchInput})`, "gi");
      const parts = text.split(regex);

      return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="text-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only respond to key events when the modal is visible
      const modal = document?.getElementById("searchModal");
      if (modal && isOpen) {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          setHighlightedIndex((prevIndex) =>
            Math.min(prevIndex + 1, response.length - 1)
          );
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        } else if (event.key === "Enter" && highlightedIndex >= 0) {
          event.preventDefault();
          handleSelectItem(response[highlightedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [highlightedIndex, response]);

  const handleSelectItem = (asset) => {
    const route =
      asset.exchange === "CRYPTO"
        ? `/markets/crypto/${changeToCrypto(asset.symbol)}`
        : (
      asset.exchange == "FUNDS"
        ? `/markets/funds/${asset.symbol}`
        : `/markets/stocks/${asset.symbol}`);

    router.push(route);
    onClose();
  };

  const handleMouseEnter = (index) => {
    setHighlightedIndex(index);
  };

  const handleMouseLeave = () => {
    setHighlightedIndex(-1);
  };

  function changeToCrypto(symbol) {
    return symbol.replace("/USD", "-usd").toLowerCase();
  }

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
          readOnly={!(isOpen)}
          value={searchInput}
          autoComplete="off"
          onChange={handleInputChange}
        />
      </div>
      {isLoading ? (
        <div className="grid place-content-center">
          <div className="place-content-center justify-self-center buttonLoader cursor-progress">
            <svg viewBox="25 25 50 50">
              <circle r="20" cy="50" cx="50"></circle>
            </svg>
          </div>  
        </div>
      ) : (
        <>
          {response?.map((asset, index) => (
            <div
              key={asset.id}
              className={`py-1 overflow-hidden ${
                highlightedIndex === index ? "bg-[#1E2124]" : ""
              }`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div
                role="button"
                onClick={() => handleSelectItem(asset)}
                className="rounded-sm px-4 py-1 grid grid-cols-2 gap-x-2 cursor-pointer"
              >
                <div className="">
                  <div className="flex flex-row"></div>
                  <div className="text-white font-light text-sm">
                    {highlightMatch(asset.symbol, searchInput)}
                  </div>
                  <div className="text-white font-thin text-sm">
                    {asset.exchange}
                  </div>
                </div>
                <div className="text-white truncate">
                  {highlightMatch(asset.name, searchInput)}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
