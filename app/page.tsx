// This is a Server Component — it runs on the server, not in the browser.
// Server Components CAN read httpOnly cookies (like our spotify_token),
// which is why we check auth here instead of in the client component.
//
// How it works:
//   1. Server reads the "spotify_token" cookie from the request
//   2. If it exists → isLoggedIn = true → renders the search UI
//   3. If it doesn't → isLoggedIn = false → renders the login button
//
// The cookie was set by app/api/auth/callback/route.ts (line 33)
// when the user completed the Spotify OAuth flow.

import { cookies } from "next/headers";
import DaylistApp from "./components/DaylistApp";

export default async function Home() {
  // cookies() is async in Next.js 15+ — we must await it.
  // cookieStore gives us access to all cookies on this request.
  const cookieStore = await cookies();

  // Check if the spotify_token cookie exists.
  // ?.value uses optional chaining — if the cookie doesn't exist,
  // get() returns undefined, and ?.value returns undefined instead
  // of crashing.
  const token = cookieStore.get("spotify_token")?.value;

  // Convert to boolean: !!undefined = false, !!"abc123" = true
  const isLoggedIn = !!token;

  // Pass the boolean to the Client Component.
  // The Client Component uses this to decide which view to show:
  //   - false → pulsating green "Login" button
  //   - true  → "Daylist" title + search bar + generate button
  return <DaylistApp isLoggedIn={isLoggedIn} />;
}
