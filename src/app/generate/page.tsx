"use client";
import { useEffect, useRef, useState } from "react";
import Markdown from "markdown-to-jsx";
export default function Upload() {
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
  const [message, setMessage] = useState("");

  const [mdx, setMdx] = useState(
    "# hello \n ### **hello2** *test3* \nregular\n ``` console.log```\n  ![alt](https://i.ibb.co/fdy1mbD/Group-4.jpg) \n\n # More pictures!! \n\n![alt](https://i.ibb.co/fdy1mbD/Group-4.jpg) \n"
  );

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
  return (
    <main className="w-full bg-white bg-[radial-gradient(#B1B1B1_1px,transparent_1px)] [background-size:48px_48px] min-h-screen flex  px-10 gap-8 pt-28 pb-12 ">
      <div className="flex flex-1  h-[48rem] sticky top-20 ">
        <div className=" bg-[#262626]  rounded-md px-4 py-8 flex-col flex justify-between  ">
          <div className="text-white tracking-wide ">Improve your report</div>
          <div className="text-xl text-white tracking-normal font-bold overflow-auto">
            <div className="p-4 ">
              {messages.map((message, index) => (
                <div key={index} className={`my-2 p-2 rounded-lg ${index % 2 === 0 ? "text-left ml-auto" : "text-right mr-auto text-xl font-light"}`}>
                  <p>{message}</p>
                </div>
              ))}
            </div>
            <div ref={scrollRef}></div>
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
      <div className="flex-[2] bg-white ring-1 ring-lime-700 outline-offset-8 p-6 rounded-xl">
        <Markdown>{mdx}</Markdown>
      </div>
    </main>
  );
}
