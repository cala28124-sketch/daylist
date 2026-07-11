"use client"

import { useState } from "react";
export default function Home() {
  const [inputValue, setInputValue] = useState("");
  <a href = "https://www.freepik.com/free-vector/gradient-music-background_13690547.htm#query=music%20background&position=0&from_view=search&track=sph">Image by rawpixel.com</a>
  
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold mb-2 text-zinc-900 dark:text-white">
        DayList
      </h1>
      <p className="text-zinc-500 mb-8 dark:text-zinc-400">
        Your Personalized Music Companion
      </p>
      <h2> Tell us about your day!! </h2>
      <input
      className = "border border-black rounded-md p-2 text-center mb-4 dark:bg-black dark:text-white" 
        type = "text" 
        value = {inputValue}
        onChange = {(e) => setInputValue(e.target.value)}
        placeholder = "Enter your moment..."
        style={{
        width: "100%",
        maxWidth: "600px",
        padding: "12px",
        borderRadius: "10px",
        fontSize: "16px"
    }}
      />
      <button onClick={handleSubmit} style={{
        marginTop: "12px",
        padding: "12px 24px",
        backgroundColor: "#6498d3",
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontSize: "16px",
        cursor: "pointer"
      }}>
        Create My DayList 🎵
      </button>
    </div>
  );
}

