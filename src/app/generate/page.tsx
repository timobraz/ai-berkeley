"use client";
import { use, useEffect, useRef, useState } from "react";
import Markdown from "markdown-to-jsx";
import { diffLines } from "diff";
import { useSearchParams } from "next/navigation";
import Loading from "../components/Loading";

const one = "beep boop";
const other = "beep boob blah";

const diff = diffLines(one, other);

interface query {
  energy_used?: string;
  percent_renewable_energy?: string;
  carbon_intensity?: string;
  total_water_withdrawn?: string;
  total_water_discharged?: string;
  total_water_consumed?: string;
  greenhouse_gas_emissions_scope_1?: string;
  greenhouse_gas_emissions_scope_2?: string;
  greenhouse_gas_emissions_scope_3?: string;
  greenhouse_gas_datacenter_total_emissions?: string;
  greenhouse_gas_purchased_goods?: string;
  greenhouse_gas_capital_goods?: string;
  waste_generated?: string;
  waste_landfilled?: string;
  waste_recycled?: string;
  air_emissions?: string;
}

export default function Upload() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<string[]>([
    "Please tell me more information about your company.",
  ]);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [params, setParams] = useState<query>();
  const [mdx, setMdx] = useState("");

  useEffect(() => {
    const filteredEntries = Array.from(searchParams).filter(
      ([key, value]) => value !== "" && key !== "description"
    );
    setParams(Object.fromEntries(filteredEntries) as unknown as query);
    setDescription(searchParams.get("description") || "");
  }, [searchParams]);

  useEffect(() => {
    if (!params) return;
    if (!description) return;
    async function generate() {
      const resp = await fetch(
        "https://flowing-magpie-sweet.ngrok-free.app/generate_report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: description,
            fields: Object.entries(params!).map(([key, value]) => {
              return { [key]: parseFloat(value) };
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
          setMdx((prev) => prev + text);
          reader.read().then(processStream);
        };

        reader.read().then(processStream);
      }
    }
    generate();
  }, [params, description]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!message) return;
    setMessages((prev) => [...prev, message]);
    try {
      const resp = await fetch(
        "https://flowing-magpie-sweet.ngrok-free.app/update_report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            suggestions: message,
            report_markdown: mdx,
          }),
        }
      );
      console.log("MARKDOWN: ", mdx);
      setMessage("");
      setMdx("");
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
          setMdx((prev) => prev + text);
          reader.read().then(processStream);
        };

        reader.read().then(processStream);
      }
    } catch (error) {
      console.error("Stream error:", error);
    }
  }

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, mdx]);
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <main className="w-full bg-white bg-[radial-gradient(#B1B1B1_1px,transparent_1px)] [background-size:48px_48px] min-h-screen flex  px-10 gap-8 pt-28 pb-12 ">
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
          <div className="flex-[2] bg-white ring-1 ring-lime-700 outline-offset-8 p-6 rounded-xl [&>*]:my-4 ">
            <Markdown
              options={{
                overrides: {
                  img: {
                    component: AsyncImage,
                  },
                },
              }}
            >
              {mdx}
            </Markdown>
          </div>
        </main>
      )}
    </div>
  );
}

const AsyncImage = ({ src, alt, ...props }: any) => {
  // State to manage loading status
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
  }, [src]);

  return (
    <>
      {!loaded ? (
        // Display a placeholder or spinner when the image is loading
        <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }}>Loading...</div>
      ) : (
        // Render the image when it's loaded
        <img src={src} alt={alt} {...props} />
      )}
    </>
  );
};
