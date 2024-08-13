// eslint-disable-next-line no-unused-vars
import React from "react";
import ChatHeader from "./ChatHeader";
import MessageBar from "./MessageBar";
import MessageContainer from "./MessageContainer";

function ChatContainer() {
  return (
    <div className="fixed top-0 h-[100vh] md:h-auto w-full md:flex-1 bg-black flex flex-col md:static">
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
}

export default ChatContainer;
