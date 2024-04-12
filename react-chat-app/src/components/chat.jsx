import React, { useEffect, useState, useContext } from "react";
import ChatContext from "./context";
import axios from "axios";

const Chat = () => {
  const {
    socket,
    loginedUser,
    allUsers,
    setAllUsers,
    // rooms,
    // setRooms,
    selectedRoomId,
    setSelectedRoomId,
    inputMessage,
    setInputMessage,
  } = useContext(ChatContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatData, setChatData] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState();
  console.log("loginedUser:", loginedUser);
  useEffect(() => {
    if (!socket) return;

    const updateChatData = (data) => {
      console.log("updateChatData",data);
      const roomIndex = chatData.findIndex((item) => item.room == data.room.name);

      if (roomIndex !== -1) {
        setChatData((prevChatData) => {
          const updatedChatData = [...prevChatData];
          updatedChatData[roomIndex].messages.push(data.message);
          return updatedChatData;
        });
      } else {
        setChatData((prevChatData) => [
          ...prevChatData,
          {
            room: data.room.name,
            messages: [data.message],
          },
        ]);
      }
    };

    socket.on("message", (data) => {
      //  console.log("Message received", data);
      updateChatData(data);
      console.log("chatData", chatData);
    });

    return () => {
      socket.off("message");
    };
  }, [socket, chatData]);

  /////////////////////////////////////////////////////////////////////////////
  // const joinRoom = (room) => {
  //   console.log("room:", room.name);
  //   setSelectedRoom(room.name);
  //   socket.emit("joinRoom", room.name);
  // };

  const sendMessage = () => {
    console.log("sendmessage");
    if (inputMessage.trim() !== "") {
      socket.emit("sendMessage", {
        loginedUser,
        selectedUser,
        room: selectedRoomId,
        message: inputMessage,
      });
      // setInputMessage("");
    }
  };

  const startChatWithUser = async (user) => {
    try {
      setSelectedUser(user);
      const makeRoomData = {
        loginedUser,
        selectedUser: user,
      };
      const response = await axios.post(
        "http://localhost:3030/api/makeroom",
        makeRoomData
      );
      let room = response.data.room;
      console.log("roooooom",room);
      setSelectedRoom(room);
      console.log("selectedRoom:",selectedRoom);
      setSelectedRoomId(room._id);
      console.log("selectedRoomId:", selectedRoomId);
      await socket.emit("joinRoom", room._id);
    } catch (error) {
      console.error("err:", error);
    } 
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
            start chat with: {user.username};
          </li>
        ))}
        {/* </ul> */}
      </div>
      {selectedUser && (
        <div>
          {/* Display selected user */}
          {/* <h2>Chatting at:{selectedRoom?.name}</h2> */}
          {/* Display messages for selected room */}
          <div>
            {chatData.map((roomData, index) => (
              <div key={index}>
                <h2>Room: {roomData.room}</h2>
                <ul>
                  {roomData.messages.map((message, messageIndex) => (
                    <li key={messageIndex}>{message}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
