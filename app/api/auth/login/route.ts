import { NextResponse } from "next/server";

import {
  generateCodeVerifier,
  generateCodeChallenge,
} from "@/lib/spotify-auth";

export async function GET() {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);

  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: "code",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    code_challenge_method: "S256",
    code_challenge: challenge,
    scope: "playlist-modify-public playlist-modify-private user-read-private",
  });

  const res = NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params}`,
  );
  res.cookies.set("verifier", verifier, { httpOnly: true, path: "/" });
  return res;
}
