// eslint-disable-next-line no-unused-vars
import React from "react";

function EmptyChatContainer() {
  return (
    <div className="flex-1 md:bg-black md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
      <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center ">
        <h3 className="poppins-medium">
          Hey <span className="text-neon-pink">There!</span>
        </h3>
      </div>
    </div>
  );
}

export default EmptyChatContainer;
