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
import { SEARCH_CONTACT } from "@/utils/constant";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/zustand/store";

function NewDM() {
  const [NewContact, setNewContact] = useState(false);
  const [searchedContact, setSearchedContacts] = useState([]);
  const { setSelectedChatType, setSelectedChatData } = useAppStore();

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
          setSearchedContacts(response.data.contacts);
        }
      } catch (error) {
        console.log({ error });
      }
    };

    if (NewContact) {
      fetchAllContacts();
    }
  }, [NewContact]);

  const searchContacts = async (searchTerm) => {
    try {
      const response = await apiClient.post(
        SEARCH_CONTACT,
        { searchTerm },
        { withCredentials: true }
      );
      if (response.status === 200 && response.data.contacts) {
        console.log(response);
        setSearchedContacts(response.data.contacts);
      }
    } catch (error) {
      console.log({ error });
    }
  };
  const selectNewContact = async (contact) => {
    setNewContact(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([]);
  };
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-50 hover:text-neon-green cursor-pointer transition-all duration-300"
              onClick={() => setNewContact(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3  text-white">
            <p>Select New Contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={NewContact} onOpenChange={setNewContact}>
        <DialogContent className="bg-[#181920] border-none text-white w-[90vw] max-w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-neon-purple">
              Select Preferred Contact
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Input
              placeholder="Search contacts"
              className="rounded-lg p-3 bg-[#2c2e3b] text-white border-none focus:outline-none focus:ring-2 focus:ring-neon-blue"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[250px]">
            <div className="flex flex-col gap-5">
              {searchedContact.length > 0 &&
                searchedContact.map((contact) => (
                  <div
                    key={contact._id}
                    className="flex gap-3 items-center cursor-pointer"
                    onClick={() => selectNewContact(contact)}
                  >
                    <div className="w-12 h-12 relative">
                      <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {contact?.pfp ? (
                          <AvatarImage
                            src={contact.pfp}
                            alt="pfp"
                            className="object-cover w-full h-full bg-black"
                          />
                        ) : (
                          <div className="uppercase h-12 w-12 text-lg md:text-xl lg:text-2xl text-neon-pink border-2 border-neon-blue flex items-center justify-center rounded-full">
                            {contact?.userName?.charAt(0) ||
                              contact?.email?.charAt(0)}
                          </div>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span>{contact?.userName || ""}</span>
                      <span>{contact?.email || ""}</span>
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
          {searchedContact.length === 0 && (
            <div className="flex flex-1 items-center justify-center text-neutral-500 text-lg">
              No contacts found. Try searching again.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewDM;
