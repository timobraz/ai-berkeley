import React, { useState } from "react";

export default function Home() {
  return (
    <div className="inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#B1B1B1_1px,transparent_1px)] [background-size:48px_48px]">
      {" "}
      <nav className="absolute w-full p-4 bg-transparent flex items-center justify-between">
        {/* set div to the very right */}
        <div className="flex items-center">
          {/* <Button variant="link" className=' font-black'>
                    <label htmlFor="file-input" className="cursor-pointer">
                        Upload
                    </label>
                    <input id="file-input" type="file" onChange={handleFileChange} className="hidden"></input>
                </Button> */}
          <h2 className="mb-4 text-lg font-bold">Environment</h2>
        </div>
        <div className="flex items-right">
          {/* <Button variant="link" className=' font-black'>
                    <label htmlFor="file-input" className="cursor-pointer">
                        Upload
                    </label>
                    <input id="file-input" type="file" onChange={handleFileChange} className="hidden"></input>
                </Button> */}
          <h2 className="mb-4 text-lg font-bold"></h2>
        </div>
      </nav>
      <div>
        {/* <div className="absolute h-40 w-40 top-1/4 left-1/4 bg-gradient-radial from-teal-400 via-blue-500 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-80 animate-blob animation-delay-2000 z-0 animation-move-1"></div>
            <div className="absolute h-40 w-40 top-2/3 left-3/4 bg-gradient-radial from-pink-500 via-purple-600 to-indigo-700 rounded-full mix-blend-multiply filter blur-3xl opacity-80 animate-blob animation-delay-2000 z-0 animation-move-2"></div>
            <div className="absolute h-40 w-40 top-3/4 left-1/3 bg-gradient-radial from-amber-400 via-red-500 to-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-80 animate-blob animation-delay-2000 z-0 animation-move-3"></div> */}
        <div className="relative flex min-h-screen items-center justify-center space-y-5 text-center pb-32">
          <div className="pb-8 w-full max-w-2xl space-y-4">
            <img 
                    src="https://i.ibb.co/fdy1mbD/Group-4.jpg"
                    alt="first_bg_img"
                    className="absolute inset-0 object-cover h-64 w-full z-0 px-10"
                    />
            <div className="py-8 space-y-2">
              
              {/* <div className="absolute inset-0 bg-black opacity-50 z-0"></div> */}
              <h1 className="mb-4 text-3xl font-bold">
                Transforming ESG Insights into Action{" "}
              </h1>
              <p className="text-gray-500 md:w-3/4 md:mx-auto lg:w-1/2 dark:text-gray-400">
                Input an ESG (Environmental, Social, and Governance) report for
                analysis and to talk to a chatbot.
              </p>
            </div>
          </div>
      </div>
      </div>
    </div>
  );
}
