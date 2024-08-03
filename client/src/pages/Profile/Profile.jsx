// eslint-disable-next-line no-unused-vars
import React from "react";
import { useAppStore } from "@/zustand/store";
function Profile() {
  const { userDetails } = useAppStore();
  console.log("hmm", userDetails);
  return (
    <div>
      Profile
      <div>email:{userDetails.email}</div>
    </div>
  );
}

export default Profile;
