import Image from "next/image";
import React, { useState } from "react";
import { Navbar } from "../components/Navbar";

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
    "You're welcome",
  ];
  return (
    <div className="h-[1907px] w-full bg-white bg-[radial-gradient(#B1B1B1_1px,transparent_1px)] [background-size:48px_48px]">
      {" "}
      <Navbar />
      <div>
        {/* <div className="absolute h-40 w-40 top-1/4 left-1/4 bg-gradient-radial from-teal-400 via-blue-500 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-80 animate-blob animation-delay-2000 z-0 animation-move-1"></div>
            <div className="absolute h-40 w-40 top-2/3 left-3/4 bg-gradient-radial from-pink-500 via-purple-600 to-indigo-700 rounded-full mix-blend-multiply filter blur-3xl opacity-80 animate-blob animation-delay-2000 z-0 animation-move-2"></div>
            <div className="absolute h-40 w-40 top-3/4 left-1/3 bg-gradient-radial from-amber-400 via-red-500 to-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-80 animate-blob animation-delay-2000 z-0 animation-move-3"></div> */}
        <div className="w-[92%] left-[4%] h-[850px] relative top-[100px]">
          <div className="w-[40%] h-[84%] right-[4%] bg-[#262626] fixed top-[100px] rounded-md p-10 flex-col flex justify-between">
            <div className="text-white tracking-wide mb-3">Chat with buddy</div>

            <div className="overflow-auto mb-[70px]">
              <div className="text-4xl text-white tracking-normal font-bold ">
                <div className="p-4">
                  {textMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`my-2 p-2 rounded-lg ${index % 2 === 0 ? "text-left ml-auto" : "text-right mr-auto text-xl"}`}
                    >
                      <p>{message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-full bg-white w-[50%] h-auto bottom-10 absolute right-10 items-center p-3 pl-5">
              <textarea
                rows="1"
                placeholder="Type here"
                className="outline-none resize-none flex items-center justify-center w-full"
              ></textarea>
            </div>
          </div>
          <div className="w-[52%] h-[40%] left-0 bg-[#ECECEC] absolute top-0 rounded-md"></div>
          <div className="w-[25%] h-[55%] right-[48%] bg-green-dots absolute top-[45%] rounded-md"></div>
          <div className="w-[24%] h-[55%] left-0 bg-green-dots absolute top-[45%] rounded-md"></div>
        </div>
        <div className=" w-[92%] left-[4%] h-[850px] relative top-[100px] mt-12">
          <div className="w-[52%] h-[40%] left-0 bg-green-100 absolute top-0 rounded-md"></div>
          <div className="w-[25%] h-[55%] right-[48%] bg-purple-100 absolute top-[45%] rounded-md"></div>
          <div className="w-[24%] h-[55%] left-0 bg-yellow-100 absolute top-[45%] rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
