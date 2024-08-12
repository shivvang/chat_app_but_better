import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constant";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/zustand/store";
function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { setUserDetails } = useAppStore();
  const validateSignIn = (email, password, confirmPassword, userName) => {
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      toast.error("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (!userName) {
      toast.error("Username is required");
      return false;
    }

    if (!password) {
      toast.error("Password is required");
      return false;
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    if (!confirmPassword) {
      toast.error("Confirm Password is required");
      return false;
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    // If all validations pass
    return true;
  };

  const validateLogIn = (email, password, userName) => {
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      toast.error("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (!userName) {
      toast.error("Username is required");
      return false;
    }

    if (!password) {
      toast.error("Password is required");
      return false;
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    // If all validations pass
    return true;
  };

  const handleSignIn = async () => {
    if (validateSignIn(email, password, confirmPassword, userName)) {
      const response = await apiClient.post(
        SIGNUP_ROUTE,
        {
          email,
          password,
          userName,
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        setUserDetails(response.data.user);
        navigate("/chat");
      }
    }
  };
  const handleLogIn = async () => {
    if (validateLogIn(email, password, userName)) {
      const response = await apiClient.post(
        LOGIN_ROUTE,
        {
          email,
          password,
          userName,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUserDetails(response.data.user);
        navigate("/chat");
      }
    }
  };
  return (
    <div className="h-[100vh] flex items-center justify-center bg-black text-white">
      <div className="h-[80vh] bg-white border-2 border-white shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-6 items-center justify-center text-black p-8">
          <h1 className="text-5xl font-bold md:text-6xl">Hello There</h1>
          <p className="font-medium text-center">Let&apos;s get this Started</p>
        </div>
        <div className="flex items-center justify-center w-full p-8">
          <Tabs className="w-full" defaultValue="login">
            <TabsList className="bg-transparent rounded-none w-full flex justify-center">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-black text-black text-opacity-90 border-b-2 border-white rounded-none w-1/2 data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-b-[#0ff0fc] p-3 transition-all duration-300 text-center"
              >
                LogIn
              </TabsTrigger>
              <TabsTrigger
                value="signin"
                className="data-[state=active]:bg-black text-black text-opacity-90 border-b-2 border-white rounded-none w-1/2 data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-b-[#FF00FF] p-3 transition-all duration-300 text-center"
              >
                SignIn
              </TabsTrigger>
            </TabsList>
            <TabsContent
              className="text-black flex flex-col gap-5 p-8"
              value="login"
            >
              <Input
                placeholder="User Name"
                type="text"
                className="border rounded-lg p-2"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <Input
                placeholder="Email"
                type="email"
                className="border rounded-lg p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="border rounded-lg p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className="bg-black text-white rounded-full p-3 border-2 border-[#0ff0fc]"
                onClick={handleLogIn}
              >
                Log-in
              </Button>
            </TabsContent>
            <TabsContent
              className="text-black flex flex-col gap-5 p-8"
              value="signin"
            >
              <Input
                placeholder="User Name"
                type="text"
                className="border rounded-lg p-2"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <Input
                placeholder="Email"
                type="email"
                className="border rounded-lg p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="border rounded-lg p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                placeholder="Confirm Password"
                type="password"
                className="border rounded-lg p-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                className="bg-black text-white rounded-full p-3 border-2 border-[#FF00FF]"
                onClick={handleSignIn}
              >
                Sign-in
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default Auth;
