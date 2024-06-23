"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { IconFileAnalytics, IconUpload } from "@tabler/icons-react";
import axios from "axios";
import clsx from "clsx";

export default function Home() {
  const [file, setFile] = useState<File>();
  function handleChange(event: any) {
    setFile(event.target.files[0]);
  }
  async function handleSubmit(e: any) {
    e.preventDefault();
    e.stopPropagation();
    if (!file) return;
    const formData = new FormData();
    console.log(file);
    formData.append("file", file);
    try {
      const response = await axios.post("http://localhost/pdf", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#B1B1B1_1.5px,transparent_1.5px)] [background-size:48px_48px] min-h-screen snap-y  overflow-y-scroll  snap-mandatory ">
      <div className="px-10 py-28 h-screen snap-start">
        <div className="relative flex  items-center justify-center space-y-5 h-full bg-green-dots rounded-xl">
          <div className="pb-8 w-full max-w-[65%] space-y-4 ">
            <div className="py-8 space-y-2 text-left mb-[200px]">
              <h1 className="mb-4 text-6xl font-light text-white inset-6">
                Transforming ESG Insights into Action{" "}
              </h1>
              <div className="flex justify-between items-center">
                <p className="text-gray-200  max-w-[75%] text-xl">
                  Input an ESG (Environmental, Social, and Governance) report
                  for analysis and to talk to a chatbot.
                </p>
                <button className="bg-white px-8 py-4 rounded-3xl text-sm mr-14">
                  try it out
                </button>
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
      <div className="min-h-screen flex px-32 flex-col gap-4 snap-start pt-16 pb-0">
        <div className="flex w-full items-center flex-col gap-4">
          <h1 className="text-6xl  font-normal">Generate Insights With</h1>
          <h4 className="text-xl text-gray-500 font-medium">
            Search a company or upload an ESG report
          </h4>
        </div>
        <div className="bg-dots2 bg-bottom w-full flex flex-col items-center py-12 rounded-lg mt-10">
          <div className="flex flex-col gap-2 relative -top-4 w-1/2">
            <h1 className="text-white  text-2xl">Search a company</h1>
            <div className="flex gap-4 items-center justify-between h-14">
              <input
                type="text"
                placeholder="company e.g. Qualcomm"
                className="p-2 px-6 text-xl w-full h-full rounded-md b-2  "
              />
              <button className="px-10 py-2 font-light text-xl h-full bg-white rounded-md ">
                Next
              </button>
            </div>
          </div>
        </div>
        <div className="bg-dots3 w-full flex flex-col items-center py-14 pb-20 rounded-lg">
          <div className="flex flex-col gap-2 relative -top-4 w-1/2 ">
            <h1 className="text-white  text-2xl">Upload a File</h1>
            <label
              className={clsx(
                "flex  flex-col items-center justify-center w-full bg-white border-dashed border-3 py-8 space-y-4 border-primary rounded-xl hover:border-[#81D2FF] cursor-pointer transition duration-200",
                file?.name &&
                  "bg-[radial-gradient(#B1B1B1_1px,transparent_1px)] [background-size:48px_48px]"
              )}
            >
              {!file ? (
                <IconUpload className="text-primary w-12 h-12" />
              ) : (
                <IconFileAnalytics className="text-primary w-12 h-12" />
              )}
              <h3 className="text-2xl font-bold">
                {file?.name ?? "File Select"}
              </h3>
              {!file && (
                <p className=" text-center">
                  Drag and drop a file here or click to select a file from your
                  device.
                </p>
              )}
              <input
                type="file"
                className="sr-only"
                onChange={handleChange}
                accept=".pdf, .csv"
              />
            </label>
            <div className="w-full justify-between mt-1 mb-5 text-white flex">
              <h1 className="text-lg font-semi-bold">Supported Format: .pdf</h1>
              <h1 className="text-lg font-semi-bold">Maximum size: 15 mb</h1>
            </div>
            <button className="px-10 py-2 font-light text-xl  self-end bg-white rounded-md w-fit h-14">
              Next
            </button>
          </div>
        </div>
      </div>
      <div className="min-h-screen flex px-32 flex-col gap-4 snap-start pt-16 pb-0">
        <div className="flex w-full items-center flex-col gap-4">
          <h1 className="text-6xl  font-normal">Generate Your ESG Report</h1>
          <h4 className="text-xl text-gray-500 font-medium">
            Input Data to Generate Your ESG Report
          </h4>
        </div>
        <div className="flex flex-row gap-10 mt-10">
          <div className="bg-dots4 bg-bottom w-full flex flex-col items-center h-[700px] rounded-lg">
            <div className="bg-[#D9D9D9] w-full h-[100px] bg-opacity-30 rounded-t-md flex p-5 items-center justify-between">
              <p className="text-white opacity-100 text-xl">Energy Used</p>
              <textarea
                rows="1"
                className="bg-transparent border-b-2 resize-none items-center flex justify-center text-xl outline-none text-white"
              ></textarea>
            </div>
            <div className="bg-[#D9D9D9] w-full h-[100px] bg-opacity-0  flex p-5 items-center justify-between">
              {" "}
              <p className="text-white opacity-100 text-xl">
                Percentage Grid Electricity
              </p>
              <textarea
                rows="1"
                className="bg-transparent border-b-2 resize-none items-center flex justify-center text-xl outline-none text-white"
              ></textarea>
            </div>
            <div className="bg-[#D9D9D9] w-full h-[100px] bg-opacity-30  flex p-5 items-center justify-between">
              {" "}
              <p className="text-white opacity-100 text-xl">
                Percentage Renewable
              </p>
              <textarea
                rows="1"
                className="bg-transparent border-b-2 resize-none items-center flex justify-center text-xl outline-none text-white"
              ></textarea>
            </div>
            <div className="bg-[#D9D9D9] w-full h-[100px] bg-opacity-0  flex p-5 items-center justify-between">
              {" "}
              <p className="text-white opacity-100 text-xl">
                Total Water Withdrawn
              </p>
              <textarea
                rows="1"
                className="bg-transparent border-b-2 resize-none items-center flex justify-center text-xl outline-none text-white"
              ></textarea>
            </div>
            <div className="bg-[#D9D9D9] w-full h-[100px] bg-opacity-30  flex p-5 items-center justify-between">
              {" "}
              <p className="text-white opacity-100 text-xl">
                Total Water Consumed
              </p>
              <textarea
                rows="1"
                className="bg-transparent border-b-2 resize-none items-center flex justify-center text-xl outline-none text-white"
              ></textarea>
            </div>
            <div className="bg-[#D9D9D9] w-full h-[100px] bg-opacity-0  flex p-5 items-center justify-between">
              {" "}
              <p className="text-white opacity-100 text-xl">Waste Generated</p>
              <textarea
                rows="1"
                className="bg-transparent border-b-2 resize-none items-center flex justify-center text-xl outline-none text-white"
              ></textarea>
            </div>
            <div className="bg-[#D9D9D9] w-full h-[100px] bg-opacity-30 rounded-b-md  flex p-5 items-center justify-between">
              {" "}
              <p className="text-white opacity-100 text-xl">Waste Landfilled</p>
              <textarea
                rows="1"
                className="bg-transparent border-b-2 resize-none items-center flex justify-center text-xl outline-none text-white"
              ></textarea>
            </div>
          </div>
          <div className="bg-dots5 w-full flex flex-col items-center h-[700px] rounded-lg">
            <div className="bg-[#D9D9D9] w-full h-[100px] bg-opacity-30 rounded-t-md  flex p-5 items-center justify-between">
              {" "}
              <p className="text-white opacity-100 text-xl">GGE Scope 1</p>
              <textarea
                rows="1"
                className="bg-transparent border-b-2 resize-none items-center flex justify-center text-xl outline-none text-white"
              ></textarea>
            </div>
            <div className="bg-[#D9D9D9] w-full h-[100px] bg-opacity-0  flex p-5 items-center justify-between">
              {" "}
              <p className="text-white opacity-100 text-xl">GGE Scope 2</p>
              <textarea
                rows="1"
                className="bg-transparent border-b-2 resize-none items-center flex justify-center text-xl outline-none text-white"
              ></textarea>
            </div>
            <div className="bg-[#D9D9D9] w-full h-[100px] bg-opacity-30  flex p-5 items-center justify-between">
              {" "}
              <p className="text-white opacity-100 text-xl">GGE Scope 3</p>
              <textarea
                rows="1"
                className="bg-transparent border-b-2 resize-none items-center flex justify-center text-xl outline-none text-white"
              ></textarea>
            </div>
            <div className="bg-[#D9D9D9] w-full h-[100px] bg-opacity-0  flex p-5 items-center justify-between">
              {" "}
              <p className="text-white opacity-100 text-xl">
                GGE DC Total Emis sions
              </p>
              <textarea
                rows="1"
                className="bg-transparent border-b-2 resize-none items-center flex justify-center text-xl outline-none text-white"
              ></textarea>
            </div>
            <div className="bg-[#D9D9D9] w-full h-[100px] bg-opacity-30  flex p-5 items-center justify-between">
              {" "}
              <p className="text-white opacity-100 text-xl">
                GGE Purchased Goods
              </p>
              <textarea
                rows="1"
                className="bg-transparent border-b-2 resize-none items-center flex justify-center text-xl outline-none text-white"
              ></textarea>
            </div>
            <div className="bg-[#D9D9D9] w-full h-[100px] bg-opacity-0  flex p-5 items-center justify-between">
              {" "}
              <p className="text-white opacity-100 text-xl">
                GGE Capital Goods
              </p>
              <textarea
                rows="1"
                className="bg-transparent border-b-2 resize-none items-center flex justify-center text-xl outline-none text-white"
              ></textarea>
            </div>
            <div className="bg-[#D9D9D9] w-full h-[100px] bg-opacity-30 rounded-b-md  flex p-5 items-center justify-between">
              {" "}
              <p className="text-white opacity-100 text-xl">Air Emissions </p>
              <textarea
                rows="1"
                className="bg-transparent border-b-2 resize-none items-center flex justify-center text-xl outline-none text-white"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
