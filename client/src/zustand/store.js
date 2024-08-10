import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice";
import { persist, createJSONStorage } from "zustand/middleware";
// create() initializes a Zustand store.
// The argument (...a) is a spread operator that gathers all arguments into an array. This allows the function to receive all necessary parameters for creating slices and the store.
// { ...createAuthSlice(...a) } calls the createAuthSlice function with the same arguments and spreads the returned properties into the store's state.

//Local Storage persists data even after the browser is closed and reopened.
//Session Storage persists data only for the duration of the page session (until the page is closed).
export const useAppStore = create(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
