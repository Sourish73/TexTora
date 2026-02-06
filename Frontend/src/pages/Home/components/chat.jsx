import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { createNewMessage, getAllMessages } from "../../../apiCalls/message";
import { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaImage, FaSmile } from "react-icons/fa";
import toast from "react-hot-toast";
import moment from "moment";
import { clearUnreadMessageCount } from "../../../apiCalls/chat";
import { setAllChats } from "../../../redux/userSlice";
import EmojiPicker from "emoji-picker-react";

function ChatArea({ socket }) {
  const { selectedChat, user, allChats } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // ===================== API =====================

  const getMessages = async () => {
    try {
      if (!selectedChat?._id) return;
      
      dispatch(showLoader());
      const response = await getAllMessages(selectedChat._id);
      dispatch(hideLoader());

      if (response.success) {
        setAllMessages(response.data);
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message);
    }
  };

  // ===================== CLEAR UNREAD MESSAGES =====================

  const clearUnreadMessages = async () => {
    try {
      if (!selectedChat?._id) return;

      const response = await clearUnreadMessageCount(selectedChat._id);
      
      if (response.success) {
        const updatedChats = allChats.map(chat =>
          chat._id === selectedChat._id
            ? { ...chat, unreadMessageCount: 0 }
            : chat
        );
        
        dispatch(setAllChats(updatedChats));

        if (socket) {
          socket.emit("clear-unread-messages", {
            chatId: selectedChat._id,
            members: selectedChat.members.map(m => m._id),
            clearedBy: user._id
          });
        }
      }
    } catch (error) {
      console.error("Error clearing unread messages:", error);
    }
  };


  useEffect(() => {
    if (!selectedChat?._id) return;
    
    const hasUnread = selectedChat.unreadMessageCount > 0 && 
                     selectedChat.lastMessage?.sender !== user._id;
    
    if (hasUnread) {
      clearUnreadMessages();
    }
  }, [selectedChat?._id]);

  // ===================== SOCKET =====================

  useEffect(() => {
    if (!socket || !selectedChat?._id) return;

    getMessages();

    const handleReceiveMessage = (msg) => {
  if (msg.chatId !== selectedChat._id) return;

 
  if (msg.sender === user._id) return;

  setAllMessages(prev => [...prev, msg]);
  clearUnreadMessages();
};


    const handleStartedTyping = (data) => {
      if (data.chatId === selectedChat._id && data.sender !== user._id) {
        setIsTyping(true);
        
        setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    };

    const handleStoppedTyping = (data) => {
      if (data.chatId === selectedChat._id && data.sender !== user._id) {
        setIsTyping(false);
      }
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("started-typing", handleStartedTyping);
    socket.on("stopped-typing", handleStoppedTyping);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("started-typing", handleStartedTyping);
      socket.off("stopped-typing", handleStoppedTyping);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [socket, selectedChat?._id, user._id]);

  // ===================== SCROLL =====================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, isTyping]);

  if (!selectedChat) {
    return (
      <div className="app-chat-area">
        <div className="no-chat-placeholder">
          <h3>Select a chat to start messaging</h3>
        </div>
      </div>
    );
  }

  const selectedUser = selectedChat.members.find(
    m => m._id !== user._id
  );

  // ===================== SEND MESSAGE =====================

  const sendMessage = async (image = null) => {
    const text = message.trim();
    if (!text && !image) return;
    
    if (isSending) return;
    
    setIsSending(true);

    try {
      const response = await createNewMessage({
        chatId: selectedChat._id,
        text: text,
        sender: user._id,
        image: image
      });

      if (response.success) {
        const newMessage = response.data;
        
        socket.emit("send-message", {
          ...newMessage,
          members: selectedChat.members.map(m => m._id),
        });

        setAllMessages(prev => [...prev, newMessage]);
        
        setMessage("");
        setShowEmojiPicker(false);
        
        socket.emit("user-stopped-typing", {
          chatId: selectedChat._id,
          members: selectedChat.members.map(m => m._id),
          sender: user._id,
        });
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSending(false);
    }
  };

  // ===================== HELPERS =====================

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const diff = moment().diff(moment(timestamp), "days");
    if (diff < 1) return `Today ${moment(timestamp).format("hh:mm A")}`;
    if (diff === 1) return `Yesterday ${moment(timestamp).format("hh:mm A")}`;
    return moment(timestamp).format("MMM D, hh:mm A");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    if (!socket || !selectedChat) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (value.trim()) {
      socket.emit("user-typing", {
        chatId: selectedChat._id,
        members: selectedChat.members.map(m => m._id),
        sender: user._id,
      });

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("user-stopped-typing", {
          chatId: selectedChat._id,
          members: selectedChat.members.map(m => m._id),
          sender: user._id,
        });
      }, 1000);
    } else {
      socket.emit("user-stopped-typing", {
        chatId: selectedChat._id,
        members: selectedChat.members.map(m => m._id),
        sender: user._id,
      });
    }
  };

  const sendImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const validTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPG, PNG, GIF)");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      await sendMessage(reader.result);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // ===================== UI =====================

  return (
    <div className="app-chat-area">
      {/* Header */}
      <div className="app-chat-area-header">
        <div className="chat-header-user">
          <div className="user-avatar">
            {selectedUser?.firstname?.[0]}
          </div>
          <div className="user-info">
            <h3>{selectedUser?.firstname} {selectedUser?.lastname}</h3>
            <span className="user-status">
              {isTyping ? "Typing..." : "Online"}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="main-chat-area">
        {allMessages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          allMessages.map((m, index) => {
            const isCurrentUser = m.sender === user._id;

            return (
              <div
                key={m._id || index}
                className={`message-container ${isCurrentUser ? "sent" : "received"}`}
              >
                <div className={isCurrentUser ? "send-message" : "received-message"}>
                  <div className="message-content">
                    {m.text && <div className="message-text">{m.text}</div>}
                    {m.image && (
                      <div className="message-image-container">
                        <img 
                          src={m.image} 
                          alt="shared" 
                          className="message-image"
                          onClick={() => window.open(m.image, '_blank')}
                        />
                      </div>
                    )}
                    <div className="message-timestamp">
                      {formatTime(m.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="typing-text">{selectedUser?.firstname} is typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="emoji-picker-container">
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              setMessage(prev => prev + emojiData.emoji);
              setShowEmojiPicker(false);
            }}
            height={350}
            width={300}
          />
        </div>
      )}

      {/* Message Input Area */}
      <div className="message-input-area">
        <div className="input-wrapper">
          <input
            className="message-input"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            type="text"
            disabled={isSending}
          />
          
          <div className="input-actions">
            <button 
              className="action-button"
              onClick={triggerFileInput}
              title="Send image"
              disabled={isSending}
            >
              <FaImage />
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.gif"
              onChange={sendImage}
              style={{ display: 'none' }}
            />

            <button 
              className={`action-button ${showEmojiPicker ? 'active' : ''}`}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              title="Emoji"
              disabled={isSending}
            >
              <FaSmile />
            </button>

            <button 
              className="action-button send-button"
              onClick={() => sendMessage()}
              disabled={(!message.trim() && !isSending) || isSending}
              title="Send message"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatArea;