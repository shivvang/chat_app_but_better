// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { CREATE_ROOM, SEARCH_CONTACT } from "@/utils/constant";
import { useAppStore } from "@/zustand/store";
import MultipleSelector from "@/components/ui/multipleSelect";

function NewRoom() {
  const { setSelectedChatType, setSelectedChatData, addRoom } = useAppStore();
  const [newRoom, setNewRoom] = useState(false);
  const [allContact, setAllContact] = useState([]);
  const [selectedContact, setSelectedContact] = useState([]);
  const [roomName, setRoomName] = useState("");

  // Fetch all contacts when the dialog is opened
  useEffect(() => {
    const fetchAllContacts = async () => {
      try {
        const response = await apiClient.post(
          SEARCH_CONTACT,
          { searchTerm: "" }, // Empty searchTerm to fetch all contacts
          { withCredentials: true }
        );

        if (response.status === 200 && response.data.contacts) {
          setAllContact(response.data.contacts);
        }
      } catch (error) {
        console.log({ error });
      }
    };

    if (newRoom) {
      fetchAllContacts();
    }
  }, [newRoom]);

  const createRoom = async () => {
    try {
      if (roomName.length > 0 && selectedContact.length > 0) {
        const response = await apiClient.post(
          CREATE_ROOM,
          {
            name: roomName,
            members: selectedContact.map((contact) => contact._id),
          },
          { withCredentials: true }
        );

        if (response.status === 200 && response.data.room) {
          setRoomName("");
          setSelectedContact([]);
          setNewRoom(false);
          addRoom(response.data.room);
        }
      }
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-50 hover:text-neon-green cursor-pointer transition-all duration-300"
              onClick={() => setNewRoom(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3  text-white">
            <p>Create New Channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={newRoom} onOpenChange={setNewRoom}>
        <DialogContent className="bg-[#181920] border-none text-white w-[90vw] max-w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-neon-purple">New Room</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Input
              placeholder="Specify Desired Room Name"
              className="rounded-lg p-3 bg-[#2c2e3b] text-white border-none focus:outline-none focus:ring-2 focus:ring-neon-blue"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
              defaultOptions={allContact}
              placeholder="Search Contacts"
              value={selectedContact}
              onChange={setSelectedContact}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600">
                  No Results Found
                </p>
              }
            />
          </div>
          <div>
            <button
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={createRoom}
            >
              Create Channel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewRoom;
