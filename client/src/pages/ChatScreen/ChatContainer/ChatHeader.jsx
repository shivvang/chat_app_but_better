// eslint-disable-next-line no-unused-vars
import React from "react";
import { useAppStore } from "@/zustand/store";
import { RiCloseFill } from "react-icons/ri";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

function ChatHeader() {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-4 md:px-10 lg:px-20 bg-black">
      <div className="flex gap-3 md:gap-5 items-center w-full justify-between">
        <div className="flex gap-4 items-center justify-center">
          <div className="w-12 h-12 relative">
            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
              {selectedChatData?.pfp ? (
                <AvatarImage
                  src={selectedChatData.pfp}
                  alt="pfp"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div className="uppercase h-12 w-12 text-lg md:text-xl lg:text-2xl text-neon-pink border-2 border-neon-blue flex items-center justify-center rounded-full">
                  {selectedChatData?.userName?.charAt(0) ||
                    selectedChatData?.email?.charAt(0)}
                </div>
              )}
            </Avatar>
          </div>
          <span className="text-neon-pink text-lg md:text-xl lg:text-2xl font-semibold">
            {selectedChatData.userName}
          </span>
        </div>
        <div className="flex items-center justify-center gap-3 md:gap-5">
          <button
            className="text-neutral-500 hover:text-neon-pink focus:outline-none transition-all duration-300"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl md:text-4xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
