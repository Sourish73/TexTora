import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { createNewChat } from "../../../apiCalls/chat";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { setAllChats, setSelectedChat } from "../../../redux/userSlice";
import moment from "moment";

function UsersList({ searchKey, socket, onlineUser }) {
  const {
    allUsers = [],
    allChats = [],
    user: currentUser,
    selectedChat,
  } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  if (!currentUser) {
    return <div>Loading users...</div>;
  }

  const startNewChat = async (searchedUserId) => {
    let response = null;
    try {
      dispatch(showLoader());
      response = await createNewChat([currentUser._id, searchedUserId]);
      dispatch(hideLoader());

      if (response.success) {
        toast.success(response.message);
        const newChat = response.data;
        const updatedChats = [...allChats, newChat];
        dispatch(setAllChats(updatedChats));
        dispatch(setSelectedChat(newChat));
      } else {
        toast.error(response.message || "Failed to create chat");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create chat");
      dispatch(hideLoader());
    }
  };

  const openChat = (selectedUserId) => {
    const chat = allChats.find(
      (chat) =>
        chat.members.some((m) => m._id === currentUser._id) &&
        chat.members.some((m) => m._id === selectedUserId)
    );

    if (chat) {
      dispatch(setSelectedChat(chat));
    }
  };

  const IsSelectedChat = (user) => {
    if (selectedChat && user) {
      return selectedChat.members.some((m) => m._id === user._id);
    }
    return false;
  };

  const getLastMessageTimeStamp = (userId) => {
    const chat = allChats.find(
      (chat) =>
        chat.members.some((m) => m._id === currentUser._id) &&
        chat.members.some((m) => m._id === userId)
    );

    if (!chat || !chat?.lastMessage) {
      return "";
    } else {
      return moment(chat?.lastMessage?.createdAt).format("hh:mm A");
    }
  };

  const getlastMessage = (userId) => {
    const chat = allChats.find(
      (chat) =>
        chat.members.some((m) => m._id === currentUser._id) &&
        chat.members.some((m) => m._id === userId)
    );

    if (!chat || !chat.lastMessage) {
      return "";
    } else {
      const msgPrefix =
        chat?.lastMessage?.sender === currentUser._id ? "You: " : "";
      return msgPrefix + (chat?.lastMessage?.text?.substring(0, 25) || "");
    }
  };

  function formatName(user) {
    const fname =
      user.firstname?.charAt(0)?.toUpperCase() +
        user.firstname?.slice(1)?.toLowerCase() || "";
    const lname =
      user.lastname?.charAt(0)?.toUpperCase() +
        user.lastname?.slice(1)?.toLowerCase() || "";
    return fname + " " + lname;
  }

  // Socket listener
  useEffect(() => {
    if (!socket) return;

    const handleSetMessageCount = (message) => {
      
      if (message.sender === currentUser._id) {
    return; // Skip processing our own messages
  }
      
      const currentChats = [...allChats];
      
      const updatedChats = currentChats.map((chat) => {
        if (chat._id === message.chatId) {
          const shouldIncrement = selectedChat?._id !== message.chatId && 
                               message.sender !== currentUser._id;
          
          return {
            ...chat,
            unreadMessageCount: shouldIncrement
              ? (chat?.unreadMessageCount || 0) + 1
              : chat?.unreadMessageCount || 0,
            lastMessage: message,
          };
        }
        return chat;
      });

      const sortedChats = [...updatedChats].sort((a, b) => {
        const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt) : new Date(0);
        const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt) : new Date(0);
        return timeB - timeA;
      });

      dispatch(setAllChats(sortedChats));
    };

    // ADDED: Handle clearing unread messages
    const handleMessageCountCleared = (data) => {
      const updatedChats = allChats.map(chat => {
        if (chat._id === data.chatId) {
          return {
            ...chat,
            unreadMessageCount: 0
          };
        }
        return chat;
      });
      
      dispatch(setAllChats(updatedChats));
    };

    socket.off("set-message-count", handleSetMessageCount);
    socket.off("message-count-cleared", handleMessageCountCleared);
    
    socket.on("set-message-count", handleSetMessageCount);
    socket.on("message-count-cleared", handleMessageCountCleared);

    return () => {
      if (socket) {
        socket.off("set-message-count", handleSetMessageCount);
        socket.off("message-count-cleared", handleMessageCountCleared);
      }
    };
  }, [socket, dispatch,  currentUser._id]);

  const getUnreadMessageCount = (userId) => {
    const chat = allChats.find(
      (chat) =>
        chat.members.some((m) => m._id === currentUser._id) &&
        chat.members.some((m) => m._id === userId)
    );

    if (
      chat &&
      chat.unreadMessageCount &&
      chat.lastMessage?.sender !== currentUser._id
    ) {
      return (
        <div className="unread-message-counter">
          {" "}
          {Math.min(chat.unreadMessageCount, 99)}{" "}
        </div>
      );
    } else {
      return null;
    }
  };

  const isAlreadyInChat = (userId) => {
    return allChats.some(
      (chat) =>
        chat.members.some((m) => m._id === currentUser._id) &&
        chat.members.some((m) => m._id === userId)
    );
  };

  function getData() {
    if (searchKey === "") {
      return [...allChats]
        .sort((a, b) => {
          const timeA = a.lastMessage?.createdAt
            ? new Date(a.lastMessage.createdAt)
            : new Date(0);
          const timeB = b.lastMessage?.createdAt
            ? new Date(b.lastMessage.createdAt)
            : new Date(0);
          return timeB - timeA;
        })
        .slice(0, 50);
    } else {
      return allUsers
        .filter((user) => {
          return (
            (user.firstname
              ?.toLowerCase()
              .includes(searchKey?.toLowerCase()) ||
              user.lastname
                ?.toLowerCase()
                .includes(searchKey?.toLowerCase())) &&
            user._id !== currentUser._id
          );
        })
        .slice(0, 30);
    }
  }

  const dataToRender = useMemo(
    () => getData(),
    [searchKey, allChats, allUsers, currentUser._id]
  );

  return (
    <>
      {Array.isArray(dataToRender) &&
        dataToRender.map((obj) => {
          let user = obj;
          if (obj.members) {
            user = obj.members.find((mem) => mem._id !== currentUser._id);
          }

          if (!user) return null;

          const isOnline = onlineUser.includes(user._id);
          const isSelected = IsSelectedChat(user);
          const chatExists = obj.members;

          return (
            <div
              className="user-search-filter"
              onClick={() => openChat(user._id)}
              key={user._id}
            >
              <div className={isSelected ? "selected-user" : "filtered-user"}>
                <div className="filter-user-display">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="Profile Pic"
                      className="user-profile-image"
                      style={isOnline ? { border: "#82e0aa 7px solid" } : {}}
                    />
                  ) : (
                    <div
                      className={
                        isSelected
                          ? "user-selected-avatar"
                          : "user-default-avatar"
                      }
                      style={isOnline ? { border: "#82e0aa 7px solid" } : {}}
                    >
                      {user.firstname?.charAt(0)?.toUpperCase()}
                      {user.lastname?.charAt(0)?.toUpperCase()}
                    </div>
                  )}

                  <div className="filter-user-details">
                    <div className="user-display-name">
                      {formatName(user)}
                      {isOnline && (
                        <span
                          style={{
                            color: "#82e0aa",
                            marginLeft: "5px",
                            fontSize: "30px",
                          }}
                        >
                          ●
                        </span>
                      )}
                    </div>
                    <div className="user-display-email">
                      {chatExists
                        ? getlastMessage(user._id) || user.email
                        : user.email}
                    </div>
                  </div>

                  <div>
                    {getUnreadMessageCount(user._id)}
                    <div className="last-message-timestamp">
                      {chatExists ? getLastMessageTimeStamp(user._id) : ""}
                    </div>
                  </div>

                  {!chatExists && !isAlreadyInChat(user._id) && (
                    <div className="user-start-chat">
                      <button
                        className="user-start-chat-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          startNewChat(user._id);
                        }}
                      >
                        Start Chat
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
}

export default UsersList;