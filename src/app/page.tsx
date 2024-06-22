import Image from "next/image";
import React,  { useState } from 'react';
// import { Input } from "@/src/app/components/input";
// import { Button } from "@/src/app/components/button";

export default function Home() {
  return (
    <div>
        <nav className="absolute w-full p-4 bg-transparent flex items-center justify-between">
            {/* set div to the very right */}
            <div className="flex items-center">
                {/* <Button variant="link" className=' font-black'>
                    <label htmlFor="file-input" className="cursor-pointer">
                        Upload
                    </label>
                    <input id="file-input" type="file" onChange={handleFileChange} className="hidden"></input>
                </Button> */}
                <h2 className="mb-4 text-lg font-bold">
                  Environment
                </h2>
            </div>
            <div className="flex items-right">
                {/* <Button variant="link" className=' font-black'>
                    <label htmlFor="file-input" className="cursor-pointer">
                        Upload
                    </label>
                    <input id="file-input" type="file" onChange={handleFileChange} className="hidden"></input>
                </Button> */}
                <h2 className="mb-4 text-lg font-bold">
                  About
                </h2 >
            </div>
        </nav>
        <div>
            {/* <div className="absolute h-40 w-40 top-1/4 left-1/4 bg-gradient-radial from-teal-400 via-blue-500 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-80 animate-blob animation-delay-2000 z-0 animation-move-1"></div>
            <div className="absolute h-40 w-40 top-2/3 left-3/4 bg-gradient-radial from-pink-500 via-purple-600 to-indigo-700 rounded-full mix-blend-multiply filter blur-3xl opacity-80 animate-blob animation-delay-2000 z-0 animation-move-2"></div>
            <div className="absolute h-40 w-40 top-3/4 left-1/3 bg-gradient-radial from-amber-400 via-red-500 to-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-80 animate-blob animation-delay-2000 z-0 animation-move-3"></div> */}

            <div className="flex min-h-screen items-center justify-center space-y-5 text-center pb-32">
                <div className="pb-8 w-full max-w-2xl space-y-4">
                    <div className="py-8 space-y-2">
                        <h1 className="mb-4 text-3xl font-bold">Transforming ESG Insights into Action </h1>
                        <p className="text-gray-500 md:w-3/4 md:mx-auto lg:w-1/2 dark:text-gray-400">
                            Input an ESG (Environmental, Social, and Governance) report for analysis and to talk to a chatbot.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
}
