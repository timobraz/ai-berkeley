"use client";
import Image from "next/image";
import React, { use, useEffect, useRef, useState } from "react";
import Radar from "../components/Radar";
import Chart from "../components/Chart";
import Loading from "../components/Loading";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { set } from "mongoose";
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log("submit");
    e.preventDefault();
    console.log(message);
    setMessages((prev) => [...prev, message, ""]);
    setMessage("");
    try {
      const resp = await fetch(
        "https://flowing-magpie-sweet.ngrok-free.app/converse_report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_history: [...messages, message].map((message, index) => {
              const role = index % 2 === 0 ? "user" : "assistant";
              return { role, content: [{ type: "text", text: message }] };
            }),
          }),
        }
      );
      if (resp.body) {
        const reader = resp.body.getReader();
        const decoder = new TextDecoder("utf-8");

        const processStream = async ({ done, value }: any) => {
          if (done) {
            console.log("Stream ended");
            return;
          }
          // Assuming the value is a chunk of text
          const text = decoder.decode(value, { stream: true });
          setMessages((prev) => [
            ...prev.slice(0, prev.length - 1),
            prev[prev.length - 1] + text,
          ]);
          reader.read().then(processStream);
        };

        reader.read().then(processStream);
      }
    } catch (error) {
      console.error("Stream error:", error);
    }
  }
  const data = [3908, 4800, 3800, 4300];

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const [message, setMessage] = useState("");
  // const data6 = [
  //   retreived.score_energy_used,
  //   retreived.score_greenhouse_gas_emissions_scope_1,
  //   retreived.score_greenhouse_gas_emissions_scope_2,
  //   retreived.score_greenhouse_gas_emissions_scope_3,
  //   retreived.score_water_withdrawn,
  //   retreived.score_waste_generated,
  // ];

  const data2 = [120, 98, 110, 120, 98, 110];
  const [charData, setCharData] = useState<number[]>([]);
  const [numData, setNumData] = useState<number[]>([]);
  const [factors, setFactors] = useState<number[]>([]);
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
      axios
        .get("https://flowing-magpie-sweet.ngrok-free.app/analyze_report")
        .then((res) => {
          console.log(res.data);
          const data = JSON.parse(res.data);
          setRetreived(data);
          setCharData([
            data.greenhouse_gas_emissions.CO2[0] +
              data.greenhouse_gas_emissions.CH4[0] +
              data.greenhouse_gas_emissions.N2O[0],
            data.greenhouse_gas_emissions.CO2[1] +
              data.greenhouse_gas_emissions.CH4[1] +
              data.greenhouse_gas_emissions.N2O[1],
            data.greenhouse_gas_emissions.CO2[2] +
              data.greenhouse_gas_emissions.CH4[2] +
              data.greenhouse_gas_emissions.N2O[2],
            data.greenhouse_gas_emissions.CO2[3] +
              data.greenhouse_gas_emissions.CH4[3] +
              data.greenhouse_gas_emissions.N2O[3],
            data.greenhouse_gas_emissions.CO2[4] +
              data.greenhouse_gas_emissions.CH4[4] +
              data.greenhouse_gas_emissions.N2O[4],
          ]);
          setNumData([
            data.score_energy_used,
            data.score_greenhouse_gas_emissions_scope_1,
            data.score_greenhouse_gas_emissions_scope_2,
            data.score_greenhouse_gas_emissions_scope_3,
            data.score_water_withdrawn,
            data.score_waste_generated,
          ]);
          setFactors([data.biggest_climate_contributing_factors]);
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
              <Chart data={charData}></Chart>
            </div>
            <div className="flex gap-4 h-full">
              <div className=" bg-dots3 rounded-md  flex-1 h-full p-5 text-white w-full text-center font-bold gap-5">
                <p className="mb-10 mt-10 text-2xl">
                  Biggest Climate-Contributing Factors
                </p>
                <p className="text-xl">{factors}</p>
              </div>

              <div className=" bg-green-dots   rounded-md   flex-1 h-full">
                <Radar data={numData}></Radar>
              </div>
            </div>
          </div>
          <div className="flex flex-1 h-[48rem] overflow-scroll sticky top-20 z-10">
            <div className=" bg-[#262626]  rounded-md px-8 py-4 flex-col flex justify-between h-max min-h-[48rem] w-full">
              <div className="text-white tracking-wide my-4 ">
                <Link href={`https://flowing-magpie-sweet.ngrok-free.app/get_file`} target="_blank" rel="noopener noreferrer"><h4 className="my-2">Report</h4></Link>
                <div className="text-xl text-white tracking-normal font-bold overflow-auto">
                  {messages.length > 0 ? (
                    <>
                      <h2 className="text-green-300">
                        Analyzing report...
                      </h2>
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`my-2 rounded-lg ${index % 2 === 1 ? "text-left ml-auto text-green-300" : "text-right mr-auto text-xl font-light"}`}
                        >
                          <p>{message}</p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <h2 className="text-green-300">
                      There are no messages yet. Start chatting!
                    </h2>
                  )}

                  <div ref={scrollRef}></div>
                </div>
              </div>

              <div className="rounded-md bg-white  bottom-10 items-center py-2 px-4 pl-4 w-full   mt-4 ">
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center justify-between"
                >
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
