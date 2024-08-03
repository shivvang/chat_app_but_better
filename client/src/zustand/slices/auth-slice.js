export const createAuthSlice = (set) => ({
  userDetails: undefined,
  setUserDetails: (userDetails) => {
    set({ userDetails });
  },
});
