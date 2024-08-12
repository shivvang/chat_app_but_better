// eslint-disable-next-line no-unused-vars
import React, { useRef, useState } from "react";
import { useAppStore } from "@/zustand/store";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { FaTrash, FaPlus } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { ADD_PFP, REMOVE_PFP, UPDATE_PASS } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { userDetails, setUserDetails } = useAppStore();
  const [hover, setHover] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const validate = (password) => {
    if (!password) {
      toast.error("Password is required");
      return false;
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };
  const saveChanges = async () => {
    if (validate(password)) {
      try {
        const response = await apiClient.post(
          UPDATE_PASS,
          { password },
          { withCredentials: true }
        );

        if (response.status === 200) {
          toast.success("updated pass");
          localStorage.removeItem("app-storage");
          navigate("/auth");
        }
      } catch (error) {
        console.log({ error });
      }
    }
  };

  const handleNavigate = () => {
    navigate("/chat");
  };

  const handleFileInputCLick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    const formdata = new FormData();
    formdata.append("pfp", file);
    const response = await apiClient.post(ADD_PFP, formdata, {
      withCredentials: true,
    });
    if (response.status === 200 && response.data.user) {
      setUserDetails({ ...userDetails, pfp: response.data.user.pfp });
      toast.success("pfp upload was successfull");
    }
  };

  const handledeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PFP, {
        withCredentials: true,
      });

      if (response.status === 204 && response.data.user) {
        setUserDetails(response.data.user);
        toast.success("pfp delete was successfull");
      }
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <div className="bg-black h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[90vw] md:w-[70vw] lg:w-[60vw]">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-3xl md:text-4xl lg:text-5xl text-white/90 cursor-pointer hover:text-neon-green transition-colors duration-300" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className="h-full w-32 md:w-48 relative flex items-center justify-center"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {userDetails.pfp ? (
                <AvatarImage
                  src={userDetails.pfp}
                  alt="pfp"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div className="uppercase h-32 w-32 md:w-48 md:h-48 text-4xl md:text-5xl text-neon-pink border-2 border-neon-blue flex items-center justify-center rounded-full">
                  {userDetails
                    ? userDetails.userName.charAt(0)
                    : userDetails.email.charAt(0)}
                </div>
              )}
            </Avatar>
            {hover && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/70 ring-2 ring-neon-pink cursor-pointer rounded-full"
                onClick={
                  userDetails.pfp ? handledeleteImage : handleFileInputCLick
                }
              >
                {userDetails.pfp ? (
                  <FaTrash className="text-neon-red text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-neon-green text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageUpload}
              name="pfp"
              accept=".png,.jpg,.jpeg,.svg,.webp"
            />
          </div>
          <div className="flex flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="email"
                type="email"
                defaultValue={userDetails.email}
                className="rounded-lg p-4 md:p-6 bg-[#2c2e3b] border-none text-white"
                disabled
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="userName"
                type="text"
                defaultValue={userDetails.userName}
                className="rounded-lg p-4 md:p-6 bg-[#2c2e3b] border-none text-white"
                disabled
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="change password"
                type="password"
                value={password}
                className="rounded-lg p-4 md:p-6 bg-[#2c2e3b] border-none text-white"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="w-full">
          <button
            className="h-12 md:h-16 w-full bg-neon-blue hover:bg-neon-green transition-all duration-300 text-white font-semibold"
            onClick={saveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
