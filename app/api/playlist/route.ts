import { NextRequest, NextResponse } from "next/server";
import { searchTrack, createPlaylist, addItemsToPlaylist } from "@/lib/spotify";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("spotify_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  }

  const { playlist_name, suggested_tracks } = await req.json();

  const uris = (
    await Promise.all(
      suggested_tracks.map((t: { title: string; artist: string }) =>
        searchTrack(token, t.title, t.artist),
      ),
    )
  ).filter(Boolean) as string[];

  const playlist = await createPlaylist(token, playlist_name);

  //might add nothing. Later if needed add a check to addItemsplaylist here and a special return here to signify for front end signal
  await addItemsToPlaylist(token, playlist.id, uris);

  return NextResponse.json({
    playlistURL: playlist.external_urls?.spotify,
    track: uris.length,
  });
}
