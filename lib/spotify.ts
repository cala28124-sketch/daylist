const BASE = "https://api.spotify.com/v1";

export async function searchTrack(
  token: string,
  title: string,
  artist: string,
) {
  const query = encodeURIComponent(`track:${title} artist:${artist}`);
  const res = await fetch(`${BASE}/search?type=track&q=${query}&limit=1`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  return data.tracks?.items?.[0]?.uri ?? null;
}

//token is users access token, name is name for playlist
//returns playlist object after creating. Requires api call to get name, and api call to create playlist
export async function createPlaylist(token: string, name: string) {
  //getrequest first happens for spotify id. Needed for a post request to create playlist.

  //further use of API, does not need user me refrence.
  const meRes = await fetch(`${BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const me = await meRes.json();
  const res = await fetch(`${BASE}/me/playlists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      name,
      description: "Made by Daylist",
      public: false,
    }),
  });

  return res.json();
}

//returns nothing. if fails returns error. First parameter is access token, second is playlist ID from struct, third is a array of uris made from first function
export async function addItemsToPlaylist(
  token: string,
  playlistId: string,
  uris: string[],
) {
  await fetch(`${BASE}/playlists/${playlistId}/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uris }),
  });
}
