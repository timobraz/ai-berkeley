"use client";
import Image from "next/image";
import React, { use, useEffect, useRef, useState } from "react";
import Radar from "../components/Radar";
import Chart from "../components/Chart";
import Loading from "../components/Loading";
import axios from "axios";
import { useSearchParams } from "next/navigation";
export default function Dashboard() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [retreived, setRetreived] = useState<any>(null);
  const searchParams = useSearchParams();
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
  useEffect(() => {
    const ticker = searchParams.get("ticker") || null;
    if (ticker) {
      axios
        .post(`https://flowing-magpie-sweet.ngrok-free.app/get_company`, {
          ticker,
        })
        .then((res) => {
          console.log(res.data);
          const length = res.data.length;
          setRetreived(res.data[length - 1]);
          console.log(res.data[length - 1]);
        });
    } else {
      axios.get("https://flowing-magpie-sweet.ngrok-free.app/analyze_report").then((res) => {
        console.log(res.data);
        const data = JSON.parse(res.data);
        setRetreived(data);
      });
    }
  }, []);
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
          <div className="flex flex-1  h-[48rem] sticky top-20 ">
            <div className=" bg-[#262626]  rounded-md px-8 py-4 flex-col flex justify-between  w-full">
              <div className="text-white tracking-wide my-4 ">
                <h4 className="my-2">Improve your report</h4>
                <div className="text-xl text-white tracking-normal font-bold overflow-auto">
                  {messages.length > 0 ? (
                    messages.map((message, index) => (
                      <div
                        key={index}
                        className={`my-2 rounded-lg ${index % 2 === 0 ? "text-left ml-auto text-green-300" : "text-right mr-auto text-xl font-light"}`}
                      >
                        <p>{message}</p>
                      </div>
                    ))
                  ) : (
                    <h2 className="text-green-300">There are no messages yet. Start chatting!</h2>
                  )}

                  <div ref={scrollRef}></div>
                </div>
              </div>

              <div className="rounded-md bg-white  bottom-10 items-center py-2 px-4 pl-4 w-full   mt-4 ">
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
