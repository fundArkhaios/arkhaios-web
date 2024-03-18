import React from "react";
import styles from "./logos.module.css";
const logoBaseUrl = "https://logos.stockanalysis.com/";
const logos = [
  "msft",
  "hood",
  "meta",
  "aapl",
  "tsla",
  "nflx",
  "duol",
  "nke",
  "pton",
  "amzn",
  "bac",
  "ko",
  "wfc",
  "f",
  "wmt",
  "vz",
  "v",
  "gm",
  "axp",
  "jpm",
  "c",
  "gs",
  "nkla",
  "rivn",
  "nio",
  "pypl",
  "adbe",
  "shop",
  "uber",
  "dbx",
  "lpl",
  "sono",
  "vzio",
  "lcid",
  "hyzn",
];

// Repeat the logos array to ensure we have enough logos to cover the animation

export default function Carousel() {
  return (
    <div className={styles.logos}>
      <div className={styles.logosSlide}>
        {logos.map((logo, index) => (
          <img
            key={index}
            src={`${logoBaseUrl}${logo}.svg`}
            alt={`${logo} logo`}
          />
        ))}
      </div>
    </div>
  );
}
