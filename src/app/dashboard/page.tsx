"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Navbar } from "../components/Navbar";
import Radar from "../components/Radar";
import Chart from "../components/Chart";
import Loading from "../components/Loading";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log("submit");
    e.preventDefault();
    console.log(message);
    setMessages((prev) => [...prev, message]);
    setMessage("");
  }
  const data = [3908, 4800, 3800, 4300];

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const [message, setMessage] = useState("");
  const data2 = [120, 98, 80, 99, 30, 65];
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full bg-white bg-[radial-gradient(#B1B1B1_1px,transparent_1px)] [background-size:48px_48px] min-h-screen flex  px-10 gap-8 pt-28 pb-12 ">
          <div className="flex flex-col  flex-1 gap-8">
            <div className=" bg-[#ECECEC] rounded-md h-full p-10 pl-5 pb-5">
              <Chart data={data}></Chart>
            </div>
            <div className="flex gap-4 h-full">
              <div className=" bg-dots3 rounded-md  flex-1 h-full p-5 text-white w-full text-center font-bold">
                Biggest Climate-Contributing Factors
              </div>
              <div className=" bg-green-dots   rounded-md   flex-1 h-full">
                <Radar data={data2}></Radar>
              </div>
            </div>
          </div>
          <div className="flex flex-1  h-full sticky top-[100px] ">
            <div className=" bg-[#262626]  rounded-md p-10 flex-col flex justify-between  ">
              <div className="text-white tracking-wide ">Chat with buddy</div>
              <div className="text-2xl text-white tracking-normal font-bold overflow-auto">
                <div className="p-4 ">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`my-2 p-2 rounded-lg ${index % 2 === 0 ? "text-left ml-auto" : "text-right mr-auto text-xl font-light"}`}
                    >
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
      )}
    </div>
  );
}
