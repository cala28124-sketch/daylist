import { GoogleGenAI } from '@Google/genai';
const ai = new GoogleGenAI;

async function Playlist(userPrompt)
{
    console.log('Generating a playlist from: "${userPrompt}$"\n');
    const response = await ai.models.generativeContent({
        model: 'gemini-2.5-flash',
        contents: 'Generate a list of 5 songs that match this vibe: "${userPrompt}$".',
        config:{
            systemInstruction:"You are a music expert. Output ONLY a clean, numbered list of songs with their artists. Do not include introductory text or conversational sign-offs.",
        }

        });
    console.log("--- AI Recommended Tracks ---");
    console.log(response.text);
    console.log("-----------------------------");

}
const testUserPrompt = "Upbeat, bass-heavy electronic tracks for gym focus";
printAISongList(testUserPrompt);
