import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [rooms, setRooms] = useState([
    { name: '100', messages: [] },
    { name: '200', messages: [] },
    { name: '300', messages: [] },
  ]); // State to store list of rooms
  const [selectedRoom, setSelectedRoom] = useState(""); // State to store selected room
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    const newSocket = io("http://localhost:3030");

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    newSocket.on("message", (data) => {
      const { room, message } = data;
      setRooms((prevRooms) =>
        prevRooms.map((r) =>
          r.name === room ? { ...r, messages: [...r.messages, message] } : r
        )
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinRoom = (room) => {
    console.log('room:',room.name)
    setSelectedRoom(room.name);
    socket.emit("joinRoom", room.name);
  };

  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      socket.emit("sendMessage", { room: selectedRoom, message: inputMessage });
      setInputMessage("");
    }
  };

  return (
    <div>
      <h1>Chat App</h1>
      <div>
        {/* List of rooms */}
        <ul>
          {rooms.map((room, index) => (
            <li key={index} onClick={() => joinRoom(room)}>
              Room {room.name}
            </li>
          ))}
        </ul>
      </div>
      {selectedRoom && ( // Render chat area only if a room is selected
        <div>
          {/* Display messages for selected room */}
          <h2>Room: {selectedRoom}</h2>
          <ul>
            {rooms
              .find((room) => room.name === selectedRoom)
              .messages.map((message, index) => (
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
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
