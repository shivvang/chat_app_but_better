// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
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

function NewDM() {
  const [NewContact, setNewContact] = useState(false);
  const [searchedContact, setSearchedContacts] = useState([]);
  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length >= 0) {
        const response = await apiClient.post(
          SEARCH_CONTACT,
          { searchTerm },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.contacts) {
          console.log(response);
          setSearchedContacts(response.data.contacts);
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
              onClick={() => setNewContact(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
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
          {searchedContact.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-neutral-500 text-lg">
              No contacts found. Try searching again.
            </div>
          ) : (
            <div>something </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewDM;
