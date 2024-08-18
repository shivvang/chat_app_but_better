// eslint-disable-next-line no-unused-vars
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/zustand/store";

const RoomList = ({ rooms }) => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const onRoomCLick = (room) => {
    setSelectedChatData(room);
    setSelectedChatType("room");
  };
  //messages
  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <ul className="space-y-4">
        {rooms.map((room) => (
          <li
            key={room._id}
            className="flex items-center bg-black dark:bg-gray-900 p-3 rounded-lg shadow-md hover:bg-gray-800 transition-all duration-200"
            onClick={() => onRoomCLick(room)}
          >
            <Avatar className="w-10 h-10 mr-3">
              <AvatarImage src={room.pfp || ""} alt={`${room.name} avatar`} />
              <AvatarFallback>
                <span className="text-lg font-semibold text-neon-green">
                  {room.name[0].toUpperCase()}
                </span>
              </AvatarFallback>
            </Avatar>
            <span className="text-base font-medium text-white">
              {room.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
