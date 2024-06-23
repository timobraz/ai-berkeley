"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import Radar from "../components/Radar";
export default function dashboard() {
  const textMessages = [
    "Start by reducing carbon footprint, water usage, waste production, and energy usage",
    "Okay thanks, how can I reduce my carbon footprint?",
    "You can reduce your carbon footprint by using renewable energy, reducing waste, and using energy-efficient appliances",
    "Okay, thanks for the information",
    "You're welcome",
    "You're welcome",
    "You're welcome",
    "You're welcome",
    "You're welcome",
    "You're welcome",
  ];
  return (
    <div className="w-full bg-white bg-[radial-gradient(#B1B1B1_1px,transparent_1px)] [background-size:48px_48px] h-screen flex  px-10 gap-8 pt-28 pb-12 ">
      {/* <div className="absolute h-40 w-40 top-1/4 left-1/4 bg-gradient-radial from-teal-400 via-blue-500 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-80 animate-blob animation-delay-2000 z-0 animation-move-1"></div>
      <div className="absolute h-40 w-40 top-2/3 left-3/4 bg-gradient-radial from-pink-500 via-purple-600 to-indigo-700 rounded-full mix-blend-multiply filter blur-3xl opacity-80 animate-blob animation-delay-2000 z-0 animation-move-2"></div>
      <div className="absolute h-40 w-40 top-3/4 left-1/3 bg-gradient-radial from-amber-400 via-red-500 to-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-80 animate-blob animation-delay-2000 z-0 animation-move-3"></div> */}
      <div className="flex flex-col  flex-1 gap-8">
        <div className=" bg-[#ECECEC] rounded-md flex-[1]"></div>
        <div className="flex gap-4 flex-[1]">
          <div className=" bg-dots3 rounded-md  flex-1"></div>
          <div className=" bg-green-dots   rounded-md   flex-1">
            <Radar></Radar>
          </div>
        </div>
      </div>
      <div className="flex flex-1 ">
        <div className=" bg-[#262626]  rounded-md p-10 flex-col flex justify-between  ">
          <div className="text-white tracking-wide ">Chat with buddy</div>
          <div className="text-2xl text-white tracking-normal font-bold overflow-auto">
            <div className="p-4 ">
              {textMessages.map((message, index) => (
                <div key={index} className={`my-2 p-2 rounded-lg ${index % 2 === 0 ? "text-left ml-auto" : "text-right mr-auto text-xl font-light"}`}>
                  <p>{message}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-full bg-white w-1/2 bottom-10 items-center p-2 pl-4 self-end my-4 ">
            <textarea rows={1} placeholder="Type here" className="outline-none resize-none flex items-center justify-center w-full"></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
