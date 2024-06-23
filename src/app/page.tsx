import Image from "next/image";
import React, { useState } from "react";
import { Navbar } from "./components/Navbar";

export default function Home() {
  return (
    <div className="inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#B1B1B1_1px,transparent_1px)] [background-size:48px_48px] min-h-screen">
      <Navbar></Navbar>
      <div className="px-10 py-28 h-screen">
        <div className="relative flex  items-center justify-center space-y-5 h-full bg-green-dots rounded-xl">
          <div className="pb-8 w-full max-w-2xl space-y-4 ">
            <div className="py-8 space-y-2 text-left">
              <h1 className="mb-4 text-4xl font-light text-white inset-6">Transforming ESG Insights into Action </h1>
              <div className="flex justify-between items-center">
                <p className="text-gray-200  max-w-[75%] text-xl">
                  Input an ESG (Environmental, Social, and Governance) report for analysis and to talk to a chatbot.
                </p>
                <button className="bg-white px-8 py-4 rounded-3xl text-sm">try it out</button>
              </div>
            </div>
            <Image
              alt="arrow"
              src="Arrow1.svg"
              width={40}
              height={40}
              className="ml-[50%] 
            animate-bounce"
            ></Image>
          </div>
        </div>
      </div>
      <div className="h-screen flex px-32 flex-col gap-8">
        <div className="flex w-full items-center flex-col gap-4">
          <h1 className="text-7xl  font-normal">Generate Insights With</h1>
          <h4 className="text-xl text-gray-500 font-medium">Search a company or upload an ESG report</h4>
        </div>
        <div className="bg-green-dots w-full flex flex-col items-center py-16 rounded-xl">
          <div className="flex flex-col gap-2 relative -top-4">
            <h1 className="text-white  text-2xl">Search a company</h1>
            <div className="flex gap-4 items-center justify-between h-14">
              <input type="text" className="p-2 px-6 text-xl w-[24rem] h-full rounded-md b-2 outline-black outline-2 outline " />
              <button className="px-10 py-2 font-light text-xl h-full bg-white rounded-md outline-black outline-2 outline">Next</button>
            </div>
          </div>
        </div>
        <div className="bg-green-dots w-full flex flex-col items-center py-16 rounded-xl">
          <div className="flex flex-col gap-2 relative -top-4">
            <h1 className="text-white  text-2xl">Upload a File</h1>
            <div className="flex gap-4 items-center justify-between h-14">
              <input type="text" className="p-2 px-6 text-xl w-[24rem] h-full rounded-md b-2 outline-black outline-2 outline " />
              <button className="px-10 py-2 font-light text-xl h-full bg-white rounded-md outline-black outline-2 outline">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
