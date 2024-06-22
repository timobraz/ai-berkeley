"use client";
import { useState } from "react";
import axios from "axios";
export default function Upload() {
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form>
        <input type="file" onChange={handleChange} />
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </main>
  );
}
