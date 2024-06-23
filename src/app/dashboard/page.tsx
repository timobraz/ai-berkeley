import Image from "next/image";
import React, { useState } from "react";
import { Navbar } from "../components/Navbar";

export default function dashboard() {
  return (
    <div className="h-[2000px] w-full bg-white bg-[radial-gradient(#B1B1B1_1px,transparent_1px)] [background-size:48px_48px]">
      {" "}
      <Navbar />
      <div>
        {/* <div className="absolute h-40 w-40 top-1/4 left-1/4 bg-gradient-radial from-teal-400 via-blue-500 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-80 animate-blob animation-delay-2000 z-0 animation-move-1"></div>
            <div className="absolute h-40 w-40 top-2/3 left-3/4 bg-gradient-radial from-pink-500 via-purple-600 to-indigo-700 rounded-full mix-blend-multiply filter blur-3xl opacity-80 animate-blob animation-delay-2000 z-0 animation-move-2"></div>
            <div className="absolute h-40 w-40 top-3/4 left-1/3 bg-gradient-radial from-amber-400 via-red-500 to-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-80 animate-blob animation-delay-2000 z-0 animation-move-3"></div> */}
        <div className=" w-[92%] left-[4%] h-[850px] relative top-[100px]">
          <div className="w-[40%] h-[850px] right-[4%] bg-blue-100 fixed top-[10%] rounded-md"></div>
          <div className="w-[52%] h-[40%] left-0 bg-green-100 absolute top-0 rounded-md"></div>
          <div className="w-[25%] h-[55%] right-[48%] bg-purple-100 absolute top-[45%] rounded-md"></div>
          <div className="w-[24%] h-[55%] left-0 bg-yellow-100 absolute top-[45%] rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
