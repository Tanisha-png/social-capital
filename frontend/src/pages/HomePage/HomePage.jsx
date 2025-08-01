// export default function HomePage() {
//   return <h1>Home Page</h1>;
// }

import React from "react";

const HomePage = () => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Fullscreen Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/SC_logo.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Optional Overlay Content */}
      <div className="relative z-10 flex items-center justify-center h-full w-full">
        <h1 className="text-white text-4xl font-bold">Welcome to Social Capital</h1>
      </div>

      {/* Optional: Overlay for readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-[5]"></div>
    </div>
  );
};

export default HomePage;