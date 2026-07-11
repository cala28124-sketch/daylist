import { NextRequest, NextResponse } from "next/server";
import { printAISongList } from "@/lib/GeminiTest";
import { searchTrack, createPlaylist, addItemsToPlaylist } from "@/lib/spotify";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("spotify_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  }

  const { moodText } = await req.json();
  if (!moodText) {
    return NextResponse.json({ error: "moodText required" }, { status: 400 });
  }

  let AIresp;
  try {
    AIresp = await printAISongList(moodText);
  } catch (err) {
    return NextResponse.json(
      { error: "couldn't generate suggestions for this mood, try again" },
      { status: 502 },
    );
  }

  const uris = (
    await Promise.all(
      AIresp.suggested_tracks.map((t: { title: string; artist: string }) =>
        searchTrack(token, t.title, t.artist),
      ),
    )
  ).filter(Boolean) as string[];

  if (uris.length === 0) {
    return NextResponse.json(
      { error: "no tracks could be found for this mood" },
      { status: 422 },
    );
  }

  const playlist = await createPlaylist(token, AIresp.playlist_name);

  //might add nothing. Later if needed add a check to addItemsplaylist here and a special return here to signify for front end signal
  await addItemsToPlaylist(token, playlist.id, uris);

  return NextResponse.json({
    playlistURL: playlist.external_urls?.spotify,
    playlistName: AIresp.playlist_name,
    track: uris.length,
  });
}
