import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice";

// create() initializes a Zustand store.
// The argument (...a) is a spread operator that gathers all arguments into an array. This allows the function to receive all necessary parameters for creating slices and the store.
// { ...createAuthSlice(...a) } calls the createAuthSlice function with the same arguments and spreads the returned properties into the store's state.

export const useAppStore = create()((...a) => ({
  ...createAuthSlice(...a),
}));
