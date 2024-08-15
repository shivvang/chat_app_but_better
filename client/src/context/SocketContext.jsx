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
    }
    return () => {
      socket.current.disconnect();
    };
  }, [userDetails]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
