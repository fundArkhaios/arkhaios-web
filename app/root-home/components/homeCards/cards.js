import { useEffect, useRef } from "react";
import "./card.css";

export default function Cards() {
  const cardRef = useRef(null); // This ref will point to the .card element

  useEffect( () => {
    console.clear();
    const featuresEl = document.querySelector(".features");
    const featureEls = document.querySelectorAll(".firstCard, .secondCard");
  
    featuresEl.addEventListener("pointermove", (ev) => {
      featureEls.forEach((featureEl) => {
        // Not optimized yet, I know
        const rect = featureEl.getBoundingClientRect();
        featureEl.style.setProperty("--x", ev.clientX - rect.left);
        featureEl.style.setProperty("--y", ev.clientY - rect.top);
      });
    });
  }, []) 
  

  return (
    <div className="grid grid-cols 1">
      
        <div className="grid grid-cols-2 place-self-center features text-black">
          <div className="firstCard"> 
            <a href="/#" className="feature-content flex">
              <div className = "">
              <p className = "text-center py-2 font-semibold text-lg h-8">Streamline the Fund Process</p>
              <p className = "text-center align-top text-sm font-light">Open a fund in less than 5 minutes.</p>
              </div>
            </a>
          </div>
          <div className="secondCard">
            <a href="/#" className="feature-content">
              <div>
              <p className = "text-center py-2 font-semibold text-lg h-8">Distributions</p>
              <p className = "text-center align-top text-sm font-light">We handle all calculations and distributions at the end of each term.</p>
              </div>
            </a>
          </div>
          <div className="secondCard">
            <a href="/#" className="feature-content">
              <div>
              <p className = "text-center py-2 font-semibold text-lg h-8">Financial Statements On-Demand</p>
              <p className = "text-center align-top text-sm font-light">No need for an accountant we handle all the paperwork.</p>
              </div>
            </a>
          </div>
          <div className="firstCard">
            <a href="/#" className="feature-content">
              <div>
              <p className = "text-center py-2 font-semibold text-lg h-8">Data On-Demand</p>
              <p className = "text-center align-top text-sm font-light">Lightning fast polling. Low latency execution.</p>
              </div>
            </a>
          </div>
          
        </div>
      
    </div>
  );
}
