import React, { useEffect, useState, useContext } from "react";
import ChatContext from "./context";
import axios from "axios";
import useUpdateChatData from "./updatechatdata";
const Chat = () => {
  const {
    chatData,
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
  console.log("loginedUser:", loginedUser);

  const getOldmessages = async () => {
    try {
      const loginedUserEmail = loginedUser.email;
      console.log("logineduser:", loginedUserEmail);
      const response = await axios.get(
        `http://localhost:3030/api/getoldmessages?loginedUserEmail=${loginedUserEmail}`
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

    socket.on("makeRoomResponse", (data) => {
      console.log("makeRoomResponse", data);
      setSelectedRoomId(data.room._id);

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
  }, [socket, loginedUser.rooms]);

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
    try {
      setSelectedUser(user);
      const makeRoomData = {
        loginedUser,
        selectedUser: user,
      };

      socket.emit("makeRoom", makeRoomData);
    } catch (error) {
      console.error("err:", error);
    }
  };

  // const [selectedRoomData, setSelectedRoomData] = useState(null);

  const selectRoom = (roomData) => {
    setSelectedRoom(roomData);
  };

  console.log("chaaaatdataaaa:", chatData);

  return (
    <div>
      <h1>Chat App</h1>
      <div>
        <h2>Users</h2>
        <ul>
          {allUsers.map((user, index) => (
            <li key={index} onClick={() => startChatWithUser(user)}>
              start chat with: {user.username};
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div>
          <h2>Rooms</h2>
          <div className="">
            <ul className="">
              {chatData?.map((r, i) => (
                <ul key={i} className="">
                  roomname: {r.name}
                  {r.messages?.map((m, j) => (
                    <li key={j} className="">
                      <br />
                      {j}: {m}
                    </li>
                  ))}
                </ul>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Sendd</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
