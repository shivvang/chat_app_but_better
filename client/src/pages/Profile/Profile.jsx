// eslint-disable-next-line no-unused-vars
import React, { useRef, useState } from "react";
import { useAppStore } from "@/zustand/store";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { FaTrash, FaPlus } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { ADD_PFP, UPDATE_PASS } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { userDetails, setUserDetails } = useAppStore();
  const [hover, setHover] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const validate = () => {
    if (!password) {
      toast.error("Password is required");
      return false;
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
  };
  const saveChanges = async () => {
    if (validate()) {
      try {
        const response = await apiClient.post(
          UPDATE_PASS,
          { password },
          { withCredentials: true }
        );

        if (response.status === 200) {
          toast.success("updated pass");
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
    console.log("what is it that were getting right now", response);
    if (response.status === 200 && response.data.user) {
      setUserDetails({ ...userDetails, pfp: response.data.user.pfp });
      toast.success("image upload was successfull");
    }
  };

  const handledeleteImage = async (event) => {};
  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
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
                <div className="uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full">
                  {userDetails
                    ? userDetails.userName.split("").shift()
                    : userDetails.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hover && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 cursor-pointer rounded-full"
                onClick={
                  userDetails.pfp ? handledeleteImage : handleFileInputCLick
                }
              >
                {userDetails.pfp ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageUpload}
              name="pfp"
              accept=".png ,.jpg ,.jpeg, .svg ,.webp"
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="email"
                type="email"
                defaultValue={userDetails.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                disabled
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="userName"
                type="text"
                defaultValue={userDetails.userName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                disabled
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="change password"
                type="text"
                value={password}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="w-full">
          <button
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
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
