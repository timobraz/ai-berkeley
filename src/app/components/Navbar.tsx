import React from "react";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="z-50 fixed w-full p-9 px-[55px] bg-transparent flex items-center justify-between">
      {/* set div to the very right */}
      <div className="flex items-center justify-between flex-row w-full">
        {/* <Button variant="link" className=' font-black'>
                    <label htmlFor="file-input" className="cursor-pointer">
                        Upload
                    </label>
                    <input id="file-input" type="file" onChange={handleFileChange} className="hidden"></input>
                </Button> */}
        <Link href="/" className="mb-4 text-lg font-bold">
          Environment
        </Link>
        <h2 className="mb-4 text-lg font-bold">Upload</h2>
      </div>
    </nav>
  );
};
