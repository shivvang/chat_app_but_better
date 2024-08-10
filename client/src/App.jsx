/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import ChatScreen from "./pages/ChatScreen/ChatScreen";
import Profile from "./pages/Profile/Profile";
import { useAppStore } from "./zustand/store";
import { apiClient } from "./lib/api-client";
import { GET_USER_DETAILS } from "./utils/constant";

const PrivateRoute = ({ children }) => {
  const { userDetails } = useAppStore();

  const isAuthenticated = !!userDetails;
  return isAuthenticated ? children : <Navigate to={"/auth"} />;
};

const AlreadyAuthenticated = ({ children }) => {
  const { userDetails } = useAppStore();
  const isAuthenticated = !!userDetails;
  return isAuthenticated ? <Navigate to={"/chat"} /> : children;
};

function App() {
  const { userDetails, setUserDetails } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await apiClient.get(GET_USER_DETAILS, {
          withCredentials: true,
        });
        console.log(response);
        if (response.data.user) {
          setUserDetails(response.data);
        }
      } catch (error) {
        console.error(
          "Error fetching user details:",
          error.response || error.message
        );
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    if (!userDetails) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [userDetails, setUserDetails]);

  if (loading) {
    return <div>Loading...</div>;
  }

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
