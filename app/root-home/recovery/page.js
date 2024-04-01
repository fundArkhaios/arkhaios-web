'use client'
import Link from 'next/link'
import "../../../output.css";
import "../globals.css";
import { useState , useContext} from 'react';
import { RecoveryContext, RecoveryContextProvider } from './RecoveryContext.js';
import RecoveryFlow from './recoveryFlow.js';
export default function Page() {
    
    

    return (
		<div className="flex min-h-screen items-center justify-center bg-base-200">
		<div className="m-4 min-h-[50vh] w-full max-w-sm lg:max-w-4xl">
			
			<div className="flex items-center justify-center gap-2 p-8">
				<svg
					width="24"
					height="24"
					viewBox="0 0 1024 1024"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<rect x="256" y="670.72" width="512" height="256" rx="128" className="fill-base-content" />
					<circle cx="512" cy="353.28" r="256" className="fill-base-content" />
					<circle
						cx="512"
						cy="353.28"
						r="261"
						stroke="black"
						strokeOpacity="0.2"
						strokeWidth="10" />
					<circle cx="512" cy="353.28" r="114.688" className="fill-base-200" />
				</svg>
				<h1 className="text-lg font-bold">Account Recovery</h1>
			</div>
		
            
			<main className="grid bg-base-100 lg:aspect-[2/1] lg:grid-cols-2">
				<figure className="pointer-events-none bg-base-300 object-cover max-lg:hidden">
					<img src="rectangle-logo.png" alt="Login"/>
				</figure>
                <RecoveryContextProvider>
                    <RecoveryFlow/>
				</RecoveryContextProvider>
			</main>	
		</div>
	</div>
    );
}