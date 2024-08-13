// eslint-disable-next-line no-unused-vars
import React from "react";
import { RiCloseFill } from "react-icons/ri";

function ChatHeader() {
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-4 md:px-10 lg:px-20 bg-black">
      <div className="flex gap-3 md:gap-5 items-center">
        <div className="flex gap-3 items-center justify-center"></div>
        <div className="flex items-center justify-center gap-3 md:gap-5">
          <button className="text-neutral-500 hover:text-neon-pink focus:outline-none transition-all duration-300">
            <RiCloseFill className="text-3xl md:text-4xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
