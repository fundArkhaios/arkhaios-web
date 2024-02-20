"use client";
import React, {useEffect } from 'react';
import Link from "next/link";

import gsap from 'gsap'
import "./globals.css";
import "./../output.css";

export default function Page() {

	
	useEffect(() => {
		gsap.to(".title", {
		  duration: 30,
		  backgroundPosition: "-960px 0",
		  repeat: -1,
		  ease: "linear"
		});
	  }, []);
	

  return (
	<>
    <main>
      <div className="landing h-screen">
        <div className="grid grid-cols-3 items-center fixed w-screen backdrop-blur-sm h-20">
			<div></div>{/* Super Important empty div. It's supposed to be 3 columns. This is the left one.*/}
          <div className="flex items-center justify-center px-1">
            <div className="flex justify-center">

              <Link href="/" className="interFont font-bold text-md text-black px-4 py-1 hover:bg-amber-50 rounded-sm">
                Businesses
              </Link>
              <Link href="/" className="interFont font-bold text-md text-black px-4 py-1 hover:bg-amber-50 rounded-sm">
                Individuals
              </Link>
            </div>
            
              <img
                src="/noBackgroundArkhaiosLogo.png"
                width={80}
                height={80}
                alt="Logo"
				className = "px-2"
              ></img>
            
            <div className="flex items-center">
              <Link href="/" className="interFont font-bold text-md text-black whitespace-nowrap px-4 py-1 hover:bg-amber-50 rounded-sm">
                Who We Are
              </Link>
              <Link href="/" className="interFont font-bold text-md text-black px-4 py-1 hover:bg-amber-50 rounded-sm">
                Contact
              </Link>
            </div>
		</div>
            <Link
              href="/login"
              className="flex justify-end no-underline mx-3 mdSizeInter px-3"
            >
              <button className="bg-amber-100 hover:bg-amber-50 rounded-sm py-2 px-7 text-black hover:no-underline">
                Login
              </button>
            </Link>
          </div>
        

        {/*<Logo/>*/}

        {/*<Fund Your Future/>*/}
		{/*<Build Your Fund/>*/}
		{/*<Message Your Friends/>*/}
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="interBold text-9xl py-1 font-black title">
            Fund your Future
          </h1>
          <Link href="/signup" className="no-underline mx-3 mdSizeInter px-3 pt-5">
            <button className="animate bg-amber-100 hover:bg-amber-50 rounded-bl-lg rounded-tr-lg hover:rounded-none py-2 px-5 hover:no-underline text-black">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </main>
	<main className = "secondBackground h-screen">
		<div className = "text-6xl py-20 px-10 josefinFont font-black text-amber-100">
			Businesses
		</div>
	</main>
	</>
  );
}
