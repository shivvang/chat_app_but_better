// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import ProfileInfo from "./ProfileInfo";
import NewConversation from "./NewConversation";
import NewRoom from "./NewRoom";
import { GET_ROOM } from "@/utils/constant";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/zustand/store";
import RoomList from "./RoomList";

function ContactsContainer() {
  const { rooms, setRooms } = useAppStore();
  useEffect(() => {
    const getRooms = async () => {
      try {
        const response = await apiClient.get(GET_ROOM, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data.rooms) {
          console.log("group created", response);
          setRooms(response.data.rooms);
        }
      } catch (error) {
        console.log({ error });
      }
    };
    getRooms();
  }, []);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-black border-r-2 border-[#2f303b] w-full">
      <div className="pt-3 text-neon-green">ChatKun</div>
      <div className="my-5">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4 mr-4">
            <Title title="Conversations" />
            <NewConversation />
          </div>
        </div>
      </div>

      <div className="my-5">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4 mr-4">
            <Title title="Rooms" />
            <NewRoom />
          </div>
          <RoomList rooms={rooms} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
}

export default ContactsContainer;

const Title = ({ title }) => {
  return (
    <h6 className="uppercase tracking-widest text-neon-pink pl-10 font-light text-sm">
      {title}
    </h6>
  );
};
