// ChatContext.js
import React, { createContext, useState, useEffect } from "react";
import io from "socket.io-client";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [rooms, setRooms] = useState([
    { name: "100", messages: [] },
    { name: "200", messages: [] },
    { name: "300", messages: [] },
  ]);

  const [selectedRoomId, setSelectedRoomId] = useState(""); // State to store selected room
  const [inputMessage, setInputMessage] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [loginedUser, setLoginedUser] = useState();
  const [chatData, setChatData] = useState([]);
 const server = "192.168.62.166";
 const port = "3030";
  useEffect(() => {
    const newSocket = io(`http://${server}:${port}`);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
        server,
        port,
        chatData,
        setChatData,
        socket,
        loginedUser,
        setLoginedUser,
        allUsers,
        setAllUsers,
        rooms,
        setRooms,
        selectedRoomId,
        setSelectedRoomId,
        inputMessage,
        setInputMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
