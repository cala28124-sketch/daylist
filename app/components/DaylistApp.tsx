"use client";

import { useState } from "react";

// This is the main client-side component that handles all user interaction.
// It receives `isLoggedIn` from the Server Component (app/page.tsx) which
// reads the httpOnly cookie server-side and passes the boolean down.
//
// Why split Server/Client like this?
//   - Server Component (page.tsx) can read httpOnly cookies — client JS cannot.
//   - Client Component (this file) handles useState, onClick, fetch — things
//     that require browser interactivity.
//   - The server renders the initial HTML (login OR search), then the client
//     "hydrates" it to make it interactive.

export default function DaylistApp({ isLoggedIn }: { isLoggedIn: boolean }) {
  // ── State ──────────────────────────────────────────────────────
  // mood: the text the user types into the input bar
  const [mood, setMood] = useState("");

  // loading: true while the API request is in flight — drives the spinner
  const [loading, setLoading] = useState(false);

  // playlistUrl: null until the playlist is created, then holds the Spotify link.
  // This is the value that controls the circle's visibility via the ternary.
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);

  // error: holds an error message if something goes wrong, null otherwise
  const [error, setError] = useState<string | null>(null);

  // ── Generate handler ───────────────────────────────────────────
  // Called when the user clicks the button or presses Enter.
  //
  // Full pipeline (all server-side inside POST /api/playlist):
  //   1. Frontend sends { moodText: "morning coffee" }
  //   2. Backend calls Gemini → gets { playlist_name, suggested_tracks }
  //   3. Backend searches Spotify for each track → gets URIs
  //   4. Backend creates playlist + fills it
  //   5. Backend returns { playlistURL, playlistName, track }
  //
  // The frontend only needs to send the mood text and handle the result.
  const handleGenerate = async () => {
    //if (!mood.trim()) return;
    console.log("BUTTON CLICKED, mood is:", mood);

    setLoading(true);
    setError(null);
    setPlaylistUrl(null);

    try {
      const res = await fetch("/api/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moodText: mood }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Use the server's error message if available, otherwise generic
        throw new Error(data.error || "Failed to generate playlist");
      }

      setPlaylistUrl(data.playlistURL);
    } catch (err) {
      // err is the Error we threw above, or a network error
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Render: Not logged in ──────────────────────────────────────
  // If the Server Component passed isLoggedIn=false (no spotify_token
  // cookie found), show the pulsating green login button.
  if (!isLoggedIn) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen">
        <a
          href="/api/auth/login"
          className="
            px-10 py-5
            bg-green-500
            text-white text-2xl font-bold
            rounded-full
            animate-pulse-green
            hover:bg-green-400
            transition-colors
          "
        >
          Login
        </a>
      </div>
    );
  }

  // ── Render: Logged in ──────────────────────────────────────────
  // The main app view: title + input + button in a flex-col on the left,
  // with a circle on the right that appears when the playlist is ready.
  return (
    <div className="flex flex-1 items-center justify-center min-h-screen px-4">
      <div className="flex items-center gap-6">
        {/* Left column: title, input, button */}
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Daylist
          </h1>
          <button onClick={handleGenerate}>test</button>
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="Describe your mood..."
            className="
              px-5 py-3.5
              rounded-xl
              bg-zinc-800/80
              text-white placeholder-zinc-500
              border border-zinc-700
              focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500
              w-96 text-lg
              transition-colors
            "
          />

          <button
            onClick={handleGenerate}
            // disabled={loading}
            className="
              px-6 py-3.5
              bg-green-500
              text-white font-bold
              rounded-xl
              hover:bg-green-400
              transition-all
              
              text-lg
            "
          >
            {loading ? (
              // Loading state: spinner icon + "Generating..." text
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Playlist"
            )}
          </button>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        {/* Right: playlist link circle
            Ternary controls visibility:
              - No link  → w-0, h-0, opacity-0, pointer-events-none (invisible, untouchable)
              - Has link → w-16, h-16, opacity-100, pointer-events-auto (visible, clickable)
            The transition-all + duration-500 makes it animate from nothing to full circle. */}
        <a
          href={playlistUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            flex items-center justify-center
            rounded-full
            bg-green-500 hover:bg-green-400
            transition-all duration-500
            ${
              playlistUrl
                ? "w-16 h-16 opacity-100 pointer-events-auto"
                : "w-0 h-0 opacity-0 pointer-events-none"
            }
          `}
        >
          {/* Play icon — only rendered when the link exists */}
          {playlistUrl && (
            <svg
              className="w-7 h-7 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </a>
      </div>
    </div>
  );
}
