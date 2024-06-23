import React from "react";
import Link from "next/link";
import Image from "next/image";

export const Navbar = () => {
  return (
    <nav className="z-50 fixed w-full p-7 px-[55px] bg-transparent flex items-center justify-between h-auto">
      {/* set div to the very right */}
      <div className="flex items-center justify-between flex-row w-full ">
        {/* <Button variant="link" className=' font-black'>
                    <label htmlFor="file-input" className="cursor-pointer">
                        Upload
                    </label>
                    <input id="file-input" type="file" onChange={handleFileChange} className="hidden"></input>
                </Button> */}
        <div className="flex flex-row items-center align-middle justify-center gap-5">
          <Image src="/logo.png" height={65} width={65} alt="asdf"></Image>
          <Link href="/" className="text-lg font-bold tracking-normal">
            earthlytics.ai
          </Link>
        </div>
        <div className="flex flex-row gap-[80px]">
          <h2 className="text-lg font-bold">About</h2>
          <h2 className="text-lg font-bold">Upload</h2>
        </div>
      </div>
    </nav>
  );
};
