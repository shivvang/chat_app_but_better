import { useAppStore } from "@/zustand/store";
// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsConatiner from "./ContactContainer/ContactConatiner";
import EmptyChatContainer from "./Empty-chat-container";
import ChatContainer from "./ChatContainer/ChatContainer";

function ChatScreen() {
  const { userDetails } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userDetails) {
      toast("Please wait...");
      navigate("/tosomewhere");
    }
  }, [userDetails, navigate]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden bg-black">
      <ContactsConatiner />
      {/* <EmptyChatContainer /> */}
      <ChatContainer />
    </div>
  );
}

export default ChatScreen;
