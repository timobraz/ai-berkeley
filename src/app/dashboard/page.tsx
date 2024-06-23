"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Navbar } from "../components/Navbar";
import Radar from "../components/Radar";
export default function Dashboard() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState([
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
  ]);
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log("submit");
    e.preventDefault();
    console.log(message);
    setMessages((prev) => [...prev, message]);
    setMessage("");
  }

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const [message, setMessage] = useState("");
  return (
    <div className="w-full bg-white bg-[radial-gradient(#B1B1B1_1px,transparent_1px)] [background-size:48px_48px] min-h-screen flex  px-10 gap-8 pt-28 pb-12 ">
      <div className="flex flex-col  flex-1 gap-8">
        <div className=" bg-[#ECECEC] rounded-md h-72"></div>
        <div className="flex gap-4 h-72">
          <div className=" bg-dots3 rounded-md  flex-1 h-72"></div>
          <div className=" bg-green-dots   rounded-md   flex-1 h-72">
            <Radar></Radar>
          </div>
        </div>
        <div className=" bg-[#ECECEC] rounded-md h-72"></div>
        <div className="flex gap-4 h-72">
          <div className=" bg-dots3 rounded-md  flex-1 h-72"></div>
          <div className=" bg-green-dots   rounded-md   flex-1 h-72">
            <Radar></Radar>
          </div>
        </div>
        <div className="flex gap-4 h-72">
          <div className=" bg-dots3 rounded-md  flex-1 h-72"></div>
          <div className=" bg-green-dots   rounded-md   flex-1 h-72">
            <Radar></Radar>
          </div>
        </div>
        <div className="flex gap-4 h-72">
          <div className=" bg-dots3 rounded-md  flex-1 h-72"></div>
          <div className=" bg-green-dots   rounded-md   flex-1 h-72">
            <Radar></Radar>
          </div>
        </div>
      </div>
      <div className="flex flex-1  h-[48rem] sticky top-20 ">
        <div className=" bg-[#262626]  rounded-md p-10 flex-col flex justify-between  ">
          <div className="text-white tracking-wide ">Chat with buddy</div>
          <div className="text-2xl text-white tracking-normal font-bold overflow-auto">
            <div className="p-4 ">
              {messages.map((message, index) => (
                <div key={index} className={`my-2 p-2 rounded-lg ${index % 2 === 0 ? "text-left ml-auto" : "text-right mr-auto text-xl font-light"}`}>
                  <p>{message}</p>
                </div>
              ))}
            </div>
            <div ref={scrollRef}></div>
          </div>
          <div className="rounded-md bg-white w-1/2 bottom-10 items-center p-2 pl-4 self-end my-4 ">
            <form onSubmit={handleSubmit} className="flex items-center justify-between">
              <input
                placeholder="Type here"
                className="outline-none resize-none flex items-center justify-center w-full"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></input>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
