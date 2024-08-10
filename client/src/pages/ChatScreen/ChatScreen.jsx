// eslint-disable-next-line no-unused-vars
import { useAppStore } from "@/zustand/store";
// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
function ChatScreen() {
  const { userDetails } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userDetails) {
      toast("please wait ....");
      navigate("/tosomewhere");
    }
  }, [userDetails, navigate]);
  return <div>ChatScreen</div>;
}

export default ChatScreen;
