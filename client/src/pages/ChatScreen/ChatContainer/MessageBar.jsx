// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import { useAppStore } from "@/zustand/store";
import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { UPLOAD_FILE_ROUTE } from "@/utils/constant";

function MessageBar() {
  const emojiPickerRef = useRef();
  const fileInputRef = useRef();
  const [message, setMessage] = useState("");
  const [uploadedFileUrls, setUploadedFileUrls] = useState([]);
  const [disableButtonUntilFIleUploaded, setDisableButtonUntilFIleUploaded] =
    useState(false);

  const [emojiPicker, setEmojiPicker] = useState(false);
  const { selectedChatType, selectedChatData, userDetails } = useAppStore();
  const socket = useSocket();
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

  const handleFileAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    setDisableButtonUntilFIleUploaded(true);
    const selectedFiles = Array.from(event.target.files);
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.data.files) setUploadedFileUrls(response.data.files);
      setDisableButtonUntilFIleUploaded(false);
    } catch (error) {
      console.error("Error uploading files:", error);
      setDisableButtonUntilFIleUploaded(false);
    }
  };

  const handleSendMessage = async () => {
    if (selectedChatType === "contact" && userDetails && selectedChatData) {
      const messagePayload = {
        sender: userDetails.id,
        recipient: selectedChatData._id,
        messageType: uploadedFileUrls.length ? "file" : "text",
        fileUrl: uploadedFileUrls.length ? uploadedFileUrls : undefined,
        content: uploadedFileUrls.length ? undefined : message,
      };

      socket.emit("sendMessage", messagePayload);

      setMessage("");
      setUploadedFileUrls([]);
    }
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
        <button
          className="text-neutral-500 hover:text-neon-green focus:text-neon-green duration-300 transition-all"
          onClick={handleFileAttachmentClick}
        >
          <GrAttachment className="text-xl md:text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple // Allow multiple file selection
        />
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
          className={`rounded-md flex items-center justify-center p-3 md:p-5 focus:border-none duration-300 transition-all ${
            disableButtonUntilFIleUploaded
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-neon-pink hover:bg-neon-purple focus:bg-neon-purple"
          }`}
          onClick={handleSendMessage}
          disabled={disableButtonUntilFIleUploaded}
        >
          <IoSend className="text-xl md:text-2xl text-white" />
        </button>
      </div>
    </div>
  );
}

export default MessageBar;
