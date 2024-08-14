// eslint-disable-next-line no-unused-vars
import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/zustand/store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import { apiClient } from "@/lib/api-client";
import { LOGOUT_ROUTE } from "@/utils/constant";

function ProfileInfo() {
  const { userDetails, setUserDetails } = useAppStore();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 && response.statusText === "OK") {
        setUserDetails(null);
        navigate("/auth");
      }
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <div className="absolute bottom-0 flex gap-3 items-center justify-between px-5 md:px-10 lg:px-20 w-full bg-black border-t-2 border-[#2f303b]">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userDetails?.pfp ? (
              <AvatarImage
                src={userDetails.pfp}
                alt="pfp"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div className="uppercase h-12 w-12 text-lg md:text-xl lg:text-2xl text-neon-pink border-2 border-neon-blue flex items-center justify-center rounded-full">
                {userDetails?.userName?.charAt(0) ||
                  userDetails?.email?.charAt(0)}
              </div>
            )}
          </Avatar>
        </div>
        <div className="text-white">{userDetails?.userName || ""}</div>
      </div>

      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                className="text-neon-purple text-xl font-medium cursor-pointer hover:text-neon-pink transition-all duration-300"
                onClick={() => navigate("/profile")}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoLogOut
                className="text-neon-purple text-xl font-medium cursor-pointer hover:text-neon-pink transition-all duration-300"
                onClick={logout}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Log Out
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default ProfileInfo;
