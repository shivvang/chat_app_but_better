// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef } from "react";
import { useAppStore } from "@/zustand/store";
import moment from "moment";
import { apiClient } from "@/lib/api-client";
import { GET_MESSAGE_ROUTE } from "@/utils/constant";
import { MdFolder } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
function MessageContainer() {
  const scrollref = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userDetails,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_MESSAGE_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );

        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log({ error });
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
    }
  }, [selectedChatType, selectedChatData, setSelectedChatMessages]);
  useEffect(() => {
    if (scrollref.current) {
      scrollref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  //This function processes all the messages and groups them by date
  const handleDateForMessages = () => {
    let lastDate = null;
    return selectedChatMessages?.map((message, idx) => {
      const messageDate = moment(message.createdAt).format("YYYY-MM-DD");

      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={idx}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.createdAt).format("LL")}
            </div>
          )}
          {renderMessages(message)}
        </div>
      );
    });
  };

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp|tiff|svg)$/i;
    return imageRegex.test(filePath);
  };

  const downloadFile = (url) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to download file");
        }
        return response.blob();
      })
      .then((blob) => {
        // Create a download link for the file
        const fileUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = fileUrl;

        // Set the filename for the download
        const fileName = url.split("/").pop();
        link.setAttribute("download", fileName);

        // Append the link, click it, then remove it
        document.body.appendChild(link);
        link.click();
        link.remove();

        // Revoke the object URL to free memory
        window.URL.revokeObjectURL(fileUrl);
      })
      .catch((error) => {
        console.error("Error downloading the file:", error);
      });
  };
  //This function handles the rendering of individual messages,
  const renderMessages = (message) => {
    const renderFiles = (fileUrls) => {
      return fileUrls.map((url, index) => {
        return checkIfImage(url) ? (
          <div
            key={index}
            className="cursor-pointer my-2"
            onClick={() => downloadFile(url)}
          >
            <img src={url} height={300} width={300} alt={`file-${index}`} />
          </div>
        ) : (
          <div
            key={index}
            className="my-2 flex items-center justify-center gap-4"
          >
            <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
              <MdFolder />
            </span>
            <span>{url.split("/").pop()}</span>
            <span
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(url)}
            >
              <IoMdArrowRoundDown />
            </span>
          </div>
        );
      });
    };

    return (
      <div
        className={`my-1 ${
          message.sender === selectedChatData._id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender !== userDetails.id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/50 border-[#ffff]/20"
            } border inline-block p-4 rounded max-w-[70%] break-words`}
          >
            {message.content}
          </div>
        )}

        {message.messageType === "file" && (
          <div
            className={`${
              message.sender !== userDetails.id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/50 border-[#ffff]/20"
            } border inline-block p-4 rounded max-w-[70%] break-words`}
          >
            {renderFiles(message.fileUrl)}
          </div>
        )}

        <div className="text-xs text-gray-600">
          {moment(message.createdAt).format("LT")}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 px-6 md:px-8 bg-black text-white scrollbar-hidden w-full">
      {selectedChatMessages?.length ? (
        handleDateForMessages()
      ) : (
        <p className="text-center text-gray-500">No messages yet</p>
      )}
      <div ref={scrollref} />
    </div>
  );
}

export default MessageContainer;
