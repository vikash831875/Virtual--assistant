import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const userDataContext = createContext();

const UserContextProvider = ({ children }) => {
  const serverUrl = "https://virtual-assistant-backend-1iye.onrender.com";

  const [userData, setUserData] = useState(null);
  const [frontendImage, setFontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // GET CURRENT USER
  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ASK ASSISTANT
  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      );

      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setFontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
};

export default UserContextProvider;
