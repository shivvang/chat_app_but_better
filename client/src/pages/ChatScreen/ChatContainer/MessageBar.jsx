// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";

function MessageBar() {
  const emojiPickerRef = useRef();
  const [message, setMessage] = useState("");
  const [emojiPicker, setEmojiPicker] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    // Logic for sending a message
  };

  return (
    <div className="h-[10vh] bg-black flex justify-center items-center px-4 md:px-8 mb-6 gap-4 md:gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-3 md:gap-5 pr-3 md:pr-5">
        <input
          type="text"
          className="flex-1 p-3 md:p-5 bg-transparent rounded-md text-white focus:border-none focus:outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="text-neutral-500 hover:text-neon-green focus:text-neon-green duration-300 transition-all">
          <GrAttachment className="text-xl md:text-2xl" />
        </button>
        <div className="relative">
          <button
            className="text-neutral-500 hover:text-neon-yellow focus:text-neon-yellow duration-300 transition-all"
            onClick={() => setEmojiPicker(true)}
          >
            <RiEmojiStickerLine className="text-xl md:text-2xl" />
          </button>
          {emojiPicker && (
            <div className="absolute bottom-16 right-0" ref={emojiPickerRef}>
              <EmojiPicker
                theme="dark"
                open={emojiPicker}
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
        <button
          className="bg-neon-purple rounded-md flex items-center justify-center p-3 md:p-5 focus:border-none hover:bg-neon-pink focus:bg-neon-pink duration-300 transition-all"
          onClick={handleSendMessage}
        >
          <IoSend className="text-xl md:text-2xl text-white" />
        </button>
      </div>
    </div>
  );
}

export default MessageBar;
