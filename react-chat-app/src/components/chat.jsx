import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const room = "room100";

  useEffect(() => {
    const newSocket = io("http://localhost:3030");

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      // Join the room after connecting to the server
      newSocket.emit("joinRoom", room);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    newSocket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      // Send message along with the room name
      socket.emit("sendMessage", { room, message: inputMessage });
      setInputMessage("");
    }
  };

  return (
    <div>
      <h1>Chat App</h1>
      <div>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
      <div>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
