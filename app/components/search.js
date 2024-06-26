"use client"
import "./components.css";
import SearchModal from "./searchModal";
import { useEffect, useState } from "react";
export default function Search() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    document.getElementById("searchModal").close();
  };

  const openModal = () => {
    setIsModalOpen(true);
    document.getElementById("searchModal").showModal();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "/" && !isModalOpen) {
        // Prevent the default '/' key action when the modal is opened
        event.preventDefault();
        openModal();
      } else if (event.key === '/' && isModalOpen) {
        event.preventDefault();
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);


  return (
    <>
      <button onClick={openModal}>
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
            className="text-white searchInput bg-black px-10 interFont text-sm"
          />
        </div>
      </button>

      <dialog id="searchModal" className="modal">
        <div className="modal-box">
          <SearchModal onClose={closeModal} isOpen={isModalOpen}/>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={closeModal}>
            Close
          </button>
        </form>
      </dialog>
    </>
  );
}
