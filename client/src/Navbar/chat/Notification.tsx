import { useContext, useState, useEffect } from "react";
import { HiChatBubbleLeft } from "react-icons/hi2";
import { ChatContext } from "../../Screens/ChatContext";
import "../../misc/Userchat.css";
import Chat from "../../Screens/chat";

interface Notification {
  senderId: string;
  chatId: string;
  text: string;
  isRead: boolean;
  createdAt: string;
}

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    allUsers,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    userChats,
    userId,
    isChatBoxOpen,
    setIsChatBoxOpen,
    updateCurrentChat
  } = useContext(ChatContext);

  const user = allUsers.find((user) => user._id === userId);

  const unreadNotifications = notifications.filter((notification) => !notification.isRead);

  const modifiedNotifications = notifications.map((n) => {
    const sender = allUsers.find((user) => user._id === n.senderId);

    return {
      ...n,
      senderName: sender?.firstname
    };
  });

  const handleNotificationClick = (notification: Notification) => {
    if (user) {
      markNotificationAsRead(notification, userChats, user, notifications);
      const selectedChat = userChats.find((chat) => chat._id === notification.chatId);
      if (selectedChat) {
        updateCurrentChat(selectedChat);
        if (!isChatBoxOpen) {
          setIsChatBoxOpen(true);
          setIsOpen(false);
        }
      }
    } else {
      console.warn("User is not defined.");
    }
  };

  const handleChatClick = () => {
    if (!isChatBoxOpen) {
      setIsChatBoxOpen(true);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isChatBoxOpen) {
      setIsOpen(false);
    }
  }, [isChatBoxOpen]);

  return (
    <div className="notifications">
      <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
        <HiChatBubbleLeft className="chat-icon" />
        {unreadNotifications.length > 0 && (
          <span className="notification-count">
            <span>{unreadNotifications.length}</span>
          </span>
        )}
      </div>
      {isOpen && (
        <div className="notifications-box">
          <div className="notifications-header">
            <h3>Chats</h3>
            <div className="mark-as-read" onClick={() => markAllNotificationsAsRead(notifications)}>
            Mark all as read  
            </div>
          </div>

          {!isChatBoxOpen && (
            <div className="chat-section" onClick={handleChatClick}>
              <Chat />
            </div>
          )}
          {/* {modifiedNotifications?.length === 0 ? (
            <span className="notification">
              <Chat />
            </span>
          ) : null} */}
          {/* {modifiedNotifications &&
            modifiedNotifications.map((n, index) => {
              return (
                <div
                  key={index}
                  className={
                    n.isRead ? "notification" : "notification not-read"
                  }
                >
                  <span></span>
                </div>
              );
            })} */}
        </div>
      )}
    </div>
  );
};

export default Notifications;
