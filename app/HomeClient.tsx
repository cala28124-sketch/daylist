"use client";

import { useState } from "react";

export default function HomeClient() {
  const [moodText, setMoodText] = useState("");
  const [playlistURL, setPlaylistURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generatePlaylist() {
    if (!moodText.trim()) return;
    setLoading(true);
    setError(null);
    setPlaylistURL(null);

    try {
      const res = await fetch("/api/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moodText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      setPlaylistURL(data.playlistURL);
    } catch {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center gap-16 bg-zinc-50 font-sans dark:bg-black">
      <a
        href="/api/auth/login"
        className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full bg-green-500 text-sm font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-green-600"
      >
        Connect Spotify
      </a>

      <div className="flex flex-col items-center gap-4">
        <input
          type="text"
          value={moodText}
          onChange={(e) => setMoodText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generatePlaylist()}
          placeholder="How are you feeling?"
          className="h-12 w-72 rounded-full border border-zinc-300 bg-white px-6 text-center text-sm shadow-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        />
        <button
          onClick={generatePlaylist}
          disabled={loading || !moodText.trim()}
          className="h-10 w-40 rounded-full bg-green-500 text-sm font-semibold text-white shadow-md transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Generating..." : "Create Playlist"}
        </button>
        {error && (
          <p className="mt-2 max-w-64 text-center text-xs text-red-500">
            {error}
          </p>
        )}
      </div>

      <a
        href={playlistURL ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex h-40 w-40 shrink-0 items-center justify-center rounded-full bg-purple-500 text-sm font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-purple-600 ${
          playlistURL
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        Open Playlist
      </a>
    </div>
  );
}
