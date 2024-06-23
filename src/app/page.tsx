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
      <Navbar></Navbar>
      <div className="px-10 py-28 h-screen snap-start">
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
      <div className="min-h-screen flex px-32 flex-col gap-8 snap-start py-16">
        <div className="flex w-full items-center flex-col gap-4">
          <h1 className="text-6xl  font-normal">Generate Insights With</h1>
          <h4 className="text-xl text-gray-500 font-medium">Search a company or upload an ESG report</h4>
        </div>
        <div className="bg-dots2 bg-bottom w-full flex flex-col items-center py-12 rounded-xl">
          <div className="flex flex-col gap-2 relative -top-4 w-1/2">
            <h1 className="text-white  text-2xl">Search a company</h1>
            <div className="flex gap-4 items-center justify-between h-14">
              <input type="text" className="p-2 px-6 text-xl w-full h-full rounded-md b-2 outline-black outline-2 outline " />
              <button className="px-10 py-2 font-light text-xl h-full bg-white rounded-md outline-black outline-2 outline">Next</button>
            </div>
          </div>
        </div>
        <div className="bg-dots3 w-full flex flex-col items-center py-12 rounded-xl">
          <div className="flex flex-col gap-2 relative -top-4 w-1/2 ">
            <h1 className="text-white  text-2xl">Upload a File</h1>
            <label
              className={clsx(
                "flex  flex-col items-center justify-center w-full bg-white outline-dashed outline-2 py-8 space-y-4 border-2 border-dashed border-primary rounded-xl",
                file?.name && "bg-[radial-gradient(#B1B1B1_1px,transparent_1px)] [background-size:48px_48px]"
              )}
            >
              {!file ? <IconUpload className="text-primary w-12 h-12" /> : <IconFileAnalytics className="text-primary w-12 h-12" />}
              <h3 className="text-2xl font-bold">{file?.name ?? "File Select"}</h3>
              {!file && <p className=" text-center">Drag and drop a file here or click to select a file from your device.</p>}
              <input type="file" className="sr-only" onChange={handleChange} accept=".pdf, .csv" />
            </label>
            <div className="w-full justify-between my-4 text-white flex">
              <h1 className="text-lg font-semi-bold">Supported Format: .pdf</h1>
              <h1 className="text-lg font-semi-bold">Maximum size: 15 mb</h1>
            </div>
            <button className="px-10 py-2 font-light text-xl  self-end bg-white rounded-md outline-black outline-2 outline w-fit h-14">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
