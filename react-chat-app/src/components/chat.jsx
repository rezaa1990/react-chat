import React, { useEffect, useState, useContext } from "react";
import ChatContext from "./context";
import axios from "axios";
import useUpdateChatData from "./updatechatdata";
const Chat = () => {
  const {
    server,
    port,
    chatData,
    setChatData,
    socket,
    loginedUser,
    allUsers,
    selectedRoomId,
    setSelectedRoomId,
    inputMessage,
    setInputMessage,
  } = useContext(ChatContext);
  const updateChatData = useUpdateChatData();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState();
  const [oldMessages, setOldMessages] = useState();
  const [itsMe, setItsMe] = useState("");
  console.log("loginedUser:", loginedUser);

  const getOldmessages = async () => {
    try {
      const loginedUserEmail = loginedUser.email;
      console.log("logineduser:", loginedUserEmail);
      const response = await axios.get(
        `http://${server}:${port}/api/getoldmessages?loginedUserEmail=${loginedUserEmail}`
      );
      let oldMessages = response.data;
      setOldMessages(oldMessages);
      console.log("oldMessages", oldMessages);
      updateChatData(oldMessages, "getOldmessages");
    } catch (error) {
      console.error("خطا:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getOldmessages();
      } catch (error) {
        console.error("Error fetching old messages:", error);
      }
    };

    fetchData();
  }, []);

  /////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (!socket) return;

    // متصل کردن به تمام روم‌های داخل loginedUser
    loginedUser.rooms.forEach((roomId) => {
      socket.emit("joinRoom", roomId);
    });

    socket.on("makeRoomResponse", async (data) => {
      console.log("makeRoomResponse", data);
      await setSelectedRoomId(data.room._id);
      const roomExists = chatData.find((room) => room.name === data.room.name);
      if (!roomExists) {
        chatData.push(data.room);
      }
      console.log("itsMe:", itsMe);
      if (data.loginedUser._id == loginedUser._id) {
        toggleRoom(data.room.name);
      }

      if (!loginedUser.rooms.includes(data.room._id)) {
        // بررسی عضویت کاربر در اتاق
        if (data.room.members.includes(loginedUser._id)) {
          // بررسی عضویت کاربر در اعضاء اتاق
          loginedUser.rooms.push(data.room._id);
          socket.emit("joinRoom", data.room._id);
        } else {
          console.log("کاربر عضو این اتاق نیست.");
        }
      }
    });

    return () => {
      if (socket) {
        loginedUser.rooms.forEach((roomId) => {
          socket.emit("leaveRoom", roomId); // جدا کردن از تمام روم‌ها در صورت قطع اتصال
        });
      }
    };
  }, [socket, loginedUser?.rooms]);

  /////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (!socket) return;
    socket.on("message", (data) => {
      console.log("Message received", data);
      updateChatData(data.newData, "socket_message");
    });

    return () => {
      socket.off("message");
    };
  }, [socket, chatData]);

  const sendMessage = () => {
    console.log("sendmessage");
    if (inputMessage.trim() !== "") {
      socket.emit("sendMessage", {
        loginedUser,
        selectedUser,
        room: selectedRoomId,
        message: inputMessage,
      });
      setInputMessage("");
    }
  };

  const startChatWithUser = async (user) => {
    setSelectedUser(user);
    const makeRoomData = {
      loginedUser,
      selectedUser: user,
    };
    socket.emit("makeRoom", makeRoomData);
  };
  const selectRoom = (roomData) => {
    setSelectedRoom(roomData);
  };

  console.log("chaaaatdataaaa:", chatData);

  const [searchValue, setSearchValue] = useState("");
  const [openRoomIndex, setOpenRoomIndex] = useState(null);
  const [showAllRooms, setShowAllRooms] = useState(true);

  const toggleRoom = (roomName) => {
    console.log("roomname:", roomName);
    console.log("roomname_type:", typeof roomName);
    const index = chatData.findIndex((room) => room.name == roomName);
    if (index !== -1) {
      setOpenRoomIndex(index);
      setShowAllRooms(false);
    } else {
      console.log("Room not found.");
    }
  };

  const showAllRoomsHandler = () => {
    setShowAllRooms(true);
    setOpenRoomIndex(null);
  };

  return (
    <div className="container">
      <div className="box">
        <h1>Chat App</h1>
        <div>
          <h2>Users</h2>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search users..."
          />
          {searchValue && (
            <div
              style={{
                zIndex: 1001,
              }}
            >
              {allUsers
                .filter((user) =>
                  user.username
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
                )
                .map((user, index) => (
                  <div
                    key={index}
                    onClick={() => startChatWithUser(user)}
                    style={{ marginBottom: "5px", cursor: "pointer" }}
                  >
                    <div>Username: {user.username}</div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div>
          <div>
            <h2>Rooms</h2>
            {showAllRooms ? (
              <>
                {chatData?.map((room, index) => (
                  <div
                    key={index}
                    onClick={() => toggleRoom(room.name)}
                    style={{ cursor: "pointer" }}
                  >
                    <h3>{room.name}</h3>
                  </div>
                ))}
              </>
            ) : (
              <>
                <button onClick={() => showAllRoomsHandler()}>Back</button>
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  <div onClick={() => setOpenRoomIndex(null)}></div>
                  {chatData[openRoomIndex]?.messages?.map((message, j) => (
                    <div key={j}>
                      <br />
                      {j}: {message}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          {!showAllRooms && (
            <div style={{ margin: "100px" }}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Sendd</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
