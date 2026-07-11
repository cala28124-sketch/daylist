import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const verifier = req.cookies.get("verifier")?.value;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: code!,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    code_verifier: verifier!,
  });

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body,
  });

  const { access_token, refresh_token } = await tokenRes.json();

  if (!access_token) {
    return NextResponse.redirect(
      new URL("/?error=auth_failed", process.env.NEXT_PUBLIC_APP_URL),
    );
  }

  const res = NextResponse.redirect(
    new URL("/", process.env.NEXT_PUBLIC_APP_URL),
  );

  res.cookies.set("spotify_token", access_token, { httpOnly: true, path: "/" });

  res.cookies.set("spotify_refresh", refresh_token, {
    httpOnly: true,
    path: "/",
  });

  return res;
}
