import { useAppStore } from "@/zustand/store";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const socket = useRef();
  const { userDetails } = useAppStore();
  useEffect(() => {
    if (userDetails) {
      socket.current = io("http://localhost:9959", {
        withCredentials: true,
        query: {
          userId: userDetails.id,
        },
      });

      socket.current.on("connect", () => {
        console.log(`connected to socket server`);
      });

      const handleRecieveMessage = (message) => {
        const { selectedChatType, selectedChatData, addMessage } =
          useAppStore.getState();

        if (
          (selectedChatType !== undefined &&
            selectedChatData._id === message.sender._id) ||
          selectedChatData._id === message.recipient._id
        ) {
          addMessage(message);
        }
      };

      const handleRoomRecieveMessage = (message) => {
        const { selectedChatType, selectedChatData, addMessage } =
          useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          selectedChatData._id === message.roomId
        ) {
          addMessage(message);
        }
      };

      socket.current.on("recieveMessage", handleRecieveMessage);
      socket.current.on("receiveRoomMessage", handleRoomRecieveMessage);
    }
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [userDetails]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
