export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  rooms: [],
  setRooms: (rooms) => set({ rooms }),
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  closeChat: () =>
    set({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessages: [],
    }),
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient: selectedChatType !== "room" && message.recipient._id,
          sender:
            selectedChatType === "room" ? message.sender : message.sender._id,
        },
      ],
    });
  },
  addRoom: (room) => {
    const rooms = get().rooms;
    set({ rooms: [room, ...rooms] });
  },
});
