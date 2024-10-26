"use client";
import { DiscordLoginButton } from "./_components/DiscordLoginButton";

const Home = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-[#083776] flex-col'>
      <h1 className='text-4xl p-3'>sumo-talk</h1>
      <DiscordLoginButton />
    </div>
  );
};

export default Home;
