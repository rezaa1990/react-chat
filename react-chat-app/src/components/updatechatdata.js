import { useContext } from "react";
import ChatContext from "./context";

const useUpdateChatData = () => {
  const { chatData, setChatData } = useContext(ChatContext);

  const updateChatData = (dataArray, caller) => {
    console.log("caller:", caller);
    console.log("dataArray:", dataArray);

    dataArray.forEach((data) => {
      console.log("updateChatData", data);

      let roomIndex = chatData.findIndex((item) => item.name === data.name);

      if (roomIndex !== -1) {
        setChatData((prevChatData) => {
          const updatedRoom = {
            ...prevChatData[roomIndex],
            messages: [...prevChatData[roomIndex].messages, data.messages],
          };
          const newChatData = [...prevChatData];
          newChatData[roomIndex] = updatedRoom;
          return newChatData;
        });
      } else {
        const newRoom = {
          name: data.name,
          messages: [data.messages],
        };
        setChatData((prevChatData) => [...prevChatData, newRoom]);
      }
    });

    console.log("chaaaatdataaaa:", chatData);
  };

  return updateChatData;
};

export default useUpdateChatData;
