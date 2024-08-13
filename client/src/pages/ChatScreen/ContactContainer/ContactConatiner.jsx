// eslint-disable-next-line no-unused-vars
import React from "react";
import ProfileInfo from "./ProfileInfo";

function ContactsContainer() {
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-black border-r-2 border-[#2f303b] w-full">
      <div className="pt-3 text-neon-green">ChatKun</div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title title="Direct Messages" />
        </div>
      </div>

      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title title="Channels" />
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
