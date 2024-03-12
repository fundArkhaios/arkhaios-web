import { useEffect, useRef } from "react";
import "./card.css";
export default function Cards() {
  const cardRef = useRef(null); // This ref will point to the .card element

  useEffect(() => {
    const handleMouseMove = (ev) => {
      const card = cardRef.current; // Accessing the card element
      if (card) {
        const rect = card.getBoundingClientRect();
        const blob = card.querySelector(".blob");
        const x = ev.clientX - rect.left - rect.width / 2;
        const y = ev.clientY - rect.top - rect.height / 2;
        blob.style.transform = `translate(${x}px, ${y}px)`;
        blob.style.opacity = "1";
      }
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", () => {
        const blob = card.querySelector(".blob");
        blob.style.opacity = "0";
        blob.style.transform = "";
      });
    }

    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <div className="grid grid-cols 1">
      <div className="place-self-center place-content-center w-5/6 bg-white rounded-md text-black h-screen">
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 text-center m-0 p-0">
          <div className="card py-5 place-self-stretch border-b-4 border-r-4 border-black">
            <div className="inner">
              <div className="text-xl font-bold">
                Streamline the Fund Process
              </div>
              <p className="text-sm font-light">
                Open a fund in less than 5 minutes.
              </p>
              <div className="blob"></div>
              <div className="fakeblob"></div>
            </div>
          </div>
          <div className="py-5 place-self-stretch border-b-4 border-l-4 border-black">
            <div className="text-xl font-bold">Distributions</div>
            <p className="text-sm font-light">
              We handle all calculations and distributions at the end of each
              term.
            </p>

            <div>
              <img src=""></img>
            </div>
          </div>
          <div className="py-5 place-self-stretch border-t-4 border-r-4 border-black">
            <div className="text-xl font-bold">
              Financial Statements On-Demand
            </div>
            <p className="text-sm font-light">
              No need for an accountant. We handle the paperwork.
            </p>
          </div>
          <div className="py-5 place-self-stretch border-t-4 border-l-4 border-black">
            <div className="text-xl font-bold">Data On-Demand</div>
            <p className="text-sm font-light">
              Lightining fast polling. Low latency execution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
