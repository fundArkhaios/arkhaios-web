"use client";
import React, { useEffect } from "react";
import Link from "next/link";

import gsap from "gsap";
import "./globals.css";
import './../../output.css'
import Carousel from "./components/logoCarousel/carousel.js";
import Cards from "./components/homeCards/cards.js";
export default function Page() {
  useEffect(() => {
    gsap.to(".title", {
      duration: 30,
      backgroundPosition: "-960px 0",
      repeat: -1,
      ease: "linear",
    });
  }, []);

  return (
    <>
      <main>
        <div className="landing h-screen">
          <div className="grid grid-cols-3 items-center fixed w-screen bg-black h-20 z-20">
            <div></div>
            {/* Super Important empty div. It's supposed to be 3 columns. This is the left one.*/}
            <div className="flex items-center justify-center px-1">
              <div className="flex justify-center">
                <Link
                  href="/"
                  className="hover:underline underline-offset-4 interFont font-bold text-md text-white px-4 py-1 rounded-sm decoration-amber-200"
                >
                  Businesses
                </Link>
                <Link
                  href="/"
                  className="hover:underline underline-offset-4 interFont font-bold text-md text-white px-4 py-1 decoration-amber-200"
                >
                  Individuals
                </Link>
              </div>

              <img
                src="/noBackgroundArkhaiosLogo.png"
                width={80}
                height={80}
                alt="Logo"
                className="px-2"
              ></img>

              <div className="flex items-center">
                <Link
                  href="/"
                  className="hover:underline underline-offset-4 interFont font-bold text-md text-white whitespace-nowrap px-4 py-1 rounded-sm"
                >
                  Who We Are
                </Link>
                <Link
                  href="/"
                  className="hover:underline underline-offset-4 interFont font-bold text-md text-white px-4 py-1 rounded-sm"
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="flex justify-end no-underline mx-3 mdSizeInter px-3">
              <Link href="/login">
                <button className="border rounded-sm outline-white py-2 px-7 text-white hover:no-underline">
                  Login
                </button>
              </Link>
            </div>
          </div>

          {/*<Logo/>*/}

          {/*<Fund Your Future/>*/}
          {/*<Build Your Fund/>*/}
          {/*<Message Your Friends/>*/}
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="interBold text-9xl py-1 font-black title">
              Fund your Future
            </h1>
            <Link
              href="/signup"
              className="no-underline mx-3 mdSizeInter px-3 pt-5"
            >
              <button className="animate bg-amber-100 hover:bg-amber-50 rounded-bl-lg rounded-tr-lg hover:rounded-none py-2 px-5 hover:no-underline text-black">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </main>
      <main className="h-screen">
        <div className="text-5xl text-left px-10 py-10 font-black text-white">
          Businesses
        </div>
        <Cards/>
      </main>

      <div className="pt-44">
        <div className="text-white font-light text-xl text-center py-2">
          Trade over 5,000 Stocks
        </div>
        <Carousel />
      </div>

      <main className="h-screen">
        <div className="text-5xl text-right px-10 pt-24 py-10 font-black text-white">
          Individuals
        </div>
        <div className="grid grid-cols 1">
          <div className="place-self-center place-content-center w-5/6 border bg-white rounded-md text-black h-4/6 min-h-screen pb-96">
            <p>Hi</p>
          </div>
        </div>
      </main>
      <main className ="pt-96">
        <footer className="footer p-10 bg-base-200 text-base-content ">
          <aside>
            <img
              src="/noBackgroundArkhaiosLogo.png"
              width={70}
              height={70}
              alt="Logo"
            ></img>
            <p>
              Arkhaios
              <br />
              Brokerage & Fund Management
            </p>
          </aside>
          <nav>
            <h6 className="footer-title">Services</h6>
            <a className="link link-hover">Branding</a>
            <a className="link link-hover">Design</a>
            <a className="link link-hover">Marketing</a>
            <a className="link link-hover">Advertisement</a>
          </nav>
          <nav>
            <h6 className="footer-title">Company</h6>
            <a className="link link-hover">About us</a>
            <a className="link link-hover">Contact</a>
            <a className="link link-hover">Jobs</a>
            <a className="link link-hover">Press kit</a>
          </nav>
          <nav>
            <h6 className="footer-title">Legal</h6>
            <a className="link link-hover">Terms of use</a>
            <a className="link link-hover">Privacy policy</a>
            <a className="link link-hover">Cookie policy</a>
          </nav>
        </footer>
      </main>
    </>
  );
}
