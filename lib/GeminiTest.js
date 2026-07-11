import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINIKEY });
export async function printAISongList(userPrompt) {
  try {
    console.log(`Curating a playlist for: "${userPrompt}"...\n`);

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate a list of 15 to 20 songs that match this vibe: "${userPrompt}".`,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 2048,
        systemInstruction: `You are a music curator. Given a described moment or mood, return JSON only, no prose, matching this shape:
                            {
                                "playlist_name": string,
                                "suggested_tracks": [{ "title": string, "artist": string }],  // 15-20 tracks
                                "search_queries": [string]  // 3-5 backup genre/mood search queries
                            }
        `,
      },
    });

    console.log("--- AI Recommended Tracks ---");
    const cleanText = response.text.replace(/```json|```/g, "").trim();
    console.log("RAW LENGTH:", cleanText.length);
    console.log("RAW TAIL:", cleanText.slice(-200)); // last 200 characters
    const jsonOutput = JSON.parse(cleanText);
    console.log(JSON.stringify(jsonOutput, null, 2));
    console.log("-----------------------------");
    return jsonOutput;
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    throw error;
  }
}

/*
const testUserPrompt = "Gym anthem";
printAISongList(testUserPrompt);
*/
