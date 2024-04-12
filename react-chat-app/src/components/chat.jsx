import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import ChatContext from "./context";

const Chat = () => {
  const {
    socket,
    loginedUser,
    allUsers,
    setAllUsers,
    rooms,
    setRooms,
    selectedRoom,
    setSelectedRoom,
    inputMessage,
    setInputMessage,
  } = useContext(ChatContext);
  const [selectedUser, setSelectedUser] = useState(null); // State to store selected user
  // const newSocket = io("http://localhost:3030");

useEffect(() => {
  if (!socket) return;

  socket.on("message", (data) => {
    console.log("Message received", data);
    // Handle incoming message here
  });

  return () => {
    socket.off("message");
  };
}, [socket]);
  /////////////////////////////////////////////////////////////////////////////
  const joinRoom = (room) => {
    console.log("room:", room.name);
    setSelectedRoom(room.name);
    socket.emit("joinRoom", room.name);
  };

  const sendMessage = () => {
    console.log("sendmessage")
    if (inputMessage.trim() !== "") {
      socket.emit("sendMessage", {
        room: selectedRoom,
        message: inputMessage,
      });
      // setInputMessage("");
    }
  };

  const startChatWithUser = (user) => {
    setSelectedUser(user);
    const newRoomName = `${loginedUser.email}_${user.email}`;
    console.log("newRoom created", newRoomName);
    setSelectedRoom(newRoomName);
    socket.emit("joinRoom", newRoomName);
  };

  return (
    <div>
      <h1>Chat App</h1>
      <div>
        {/* Display list of users */}
        <h2>Users</h2>
        {/* <ul> */}
        {allUsers.map((user, index) => (
          <li key={index} onClick={() => startChatWithUser(user)}>
            start chat with: {user.username}
          </li>
        ))}
        {/* </ul> */}
      </div>
      {selectedUser && (
        <div>
          {/* Display selected user */}
          <h2>Chatting with: {selectedUser.username}</h2>
          {/* Display messages for selected room */}
          <ul>
            {rooms
              .find((room) => room.name == selectedRoom)
              ?.messages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
          </ul>
          <div>
            {/* Input for typing message */}
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            {/* Button to send message */}
            <button onClick={sendMessage}>Sendd</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
