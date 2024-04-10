// ChatContext.js
import React, { createContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [rooms, setRooms] = useState([
    { name: "100", messages: [] },
    { name: "200", messages: [] },
    { name: "300", messages: [] },
  ]);

  const [selectedRoom, setSelectedRoom] = useState(""); // State to store selected room
  const [inputMessage, setInputMessage] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [loginedUser, setLoginedUser] = useState();

  return (
    <ChatContext.Provider
      value={{
        loginedUser, 
        setLoginedUser,
        allUsers, 
        setAllUsers,
        rooms,
        setRooms,
        selectedRoom,
        setSelectedRoom,
        inputMessage,
        setInputMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
