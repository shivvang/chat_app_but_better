/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import ChatScreen from "./pages/ChatScreen/ChatScreen";
import Profile from "./pages/Profile/Profile";
import { useAppStore } from "./zustand/store";
const PrivateRoute = ({ Children }) => {
  const { userDetails } = useAppStore();
  const isAuthenticated = !userDetails;
  return isAuthenticated ? Children : <Navigate to={"/auth"} />;
};

const AlreadyAuthenticated = ({ Children }) => {
  const { userDetails } = useAppStore();
  const isAuthenticated = !userDetails;
  return isAuthenticated ? <Navigate to={"/chat"} /> : Children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AlreadyAuthenticated>
              <Auth />
            </AlreadyAuthenticated>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
