import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <a
        className=" w-[500px] h-[500px] bg-blue-500 text-2xl"
        href="/api/auth/login"
      >
        Connect Spotify
      </a>
    </div>
  );
}
