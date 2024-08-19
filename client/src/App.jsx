// eslint-disable-next-line no-unused-vars
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Lazy load pages
const Auth = lazy(() => import("./pages/Auth/Auth"));
const ChatScreen = lazy(() => import("./pages/ChatScreen/ChatScreen"));
const Profile = lazy(() => import("./pages/Profile/Profile"));

import { useAppStore } from "./zustand/store";

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

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen bg-gray-900">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-neon-green"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}></Suspense>
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
