import { useContext, useEffect, useState } from "react";
import "./Navbar.css";
import logoKKU from "../pic/logo-head.jpg";
import { Link, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { LuFileEdit } from "react-icons/lu";
import { UserContext } from "../App";
import { IoNotificationsOutline } from "react-icons/io5";
import UserNavigationPanel from "../components/user-navigation.component";
import axios from "axios";
import Notifications from "./chat/Notification";

function Navbar() {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);
  const [userNotiPanel, setUserNotiPanel] = useState(false);
  const navigate = useNavigate();
  const {
    userAuth: { username },
    setUserAuth,
  } = useContext(UserContext);
  const userId = sessionStorage.getItem("userId");

  const [notifications, setNotifications] = useState<any[]>([]);
  const API_BASE_URL = process.env.REACT_APP_API_ENDPOINT;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/notifications/${userId}`
          );

          if (response.status === 200) {
            setNotifications(response.data);
            console.log(response.data);
          } else {
            console.error("Failed to fetch notifications:", response.data);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 5000);
    return () => clearInterval(intervalId);
  }, [userId]);

  const handleNotificationClick = async (
    e: React.MouseEvent<HTMLDivElement>,
    type: string,
    notificationId: string,
    entityId: string,
    userId: string
  ) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/notifications/${notificationId}/mark-as-read`
      );

      if (response.status === 200) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === notificationId
              ? { ...notification, seen: true }
              : notification
          )
        );
        navigate(
          type === "follow"
            ? `/user/${userId}`
            : type === "delete"
            ? `/`
            : `/blog/${entityId}`
        );
      } else {
        console.error("Failed to mark notification as read:", response.data);
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const {
    userAuth: { access_token, profile_picture },
  } = useContext(UserContext);

  const handleNavpanel = () => {
    setUserNavPanel((currentVal) => !currentVal);
  };

  const handleNotiPanel = () => {
    setUserNotiPanel((currentVal) => !currentVal);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value;

    if (e.key === "Enter" && query.length) {
      navigate(`/search/${query}`);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 200);
  };

  console.log("notifications.length", notifications);

  const countUnseenNotifications = (notifications: any) => {
    if (!Array.isArray(notifications)) {
      throw new Error("Invalid data type: notifications should be an array.");
    }

    return notifications.reduce((count, notification) => {
      if (typeof notification.seen !== "boolean") {
        throw new Error(
          "Invalid data type: notification.seen should be a boolean."
        );
      }

      return notification.seen === false ? count + 1 : count;
    }, 0);
  };

  const handleNotiBlur = () => {
    setTimeout(() => {
      setUserNotiPanel(false);
    }, 200);
  };

  return (
    <nav className="navbar-navbar">
      <Link to="/" className="logo-link">
        <img src={logoKKU} alt="Logo" className="logo-img" />
      </Link>

      <div
        className={`search-container ${searchBoxVisibility ? "show" : "hide"} `}
      >
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          onKeyDown={handleSearch}
        />
        <IoIosSearch className="icon-search" />
      </div>

      <div className="toggle-search">
        <button
          onClick={() => setSearchBoxVisibility((currentval) => !currentval)}
        >
          <IoIosSearch className="toggle-icon" />
        </button>

        <Link
          to="/editor"
          className="d-none d-md-flex align-items-center gap-2 md:flex gap-2 link"
          style={{ textDecoration: "none" }}
        >
          <LuFileEdit />
          <p className="m-0">เขียน</p>
        </Link>

        {access_token ? (
          <>
            <Notifications />

            {/* <Link to="/dashboard/notification"> */}
            <div
              className="relative"
              style={{ position: "relative" }}
              onClick={handleNotiPanel}
              onBlur={handleNotiBlur}
            >
              <button className="button-noti">
                <IoNotificationsOutline
                  className="d-block"
                  style={{ fontSize: "1.5rem" }}
                />
                {countUnseenNotifications(notifications) > 0 && (
                  <p
                    style={{
                      backgroundColor: "red",
                      borderRadius: "50px",
                      width: "1.2rem",
                      height: "1.2rem",
                      color: "white",
                      marginTop: "-1rem",
                      marginRight: "-1rem",
                      fontSize: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {countUnseenNotifications(notifications)}
                  </p>
                )}
              </button>

              {userNotiPanel ? (
                <div
                  style={{
                    padding: "1rem",
                    position: "absolute",
                    width: "25rem",
                    right: "0",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    marginTop: "1rem",
                    zIndex: 1000,
                    maxHeight: "500px", // ความสูงสูงสุด
                    overflowY: "auto", // เปิด scroll
                  }}
                >
                  <h4 style={{marginLeft:"0.5rem"}}>การแจ้งเตือน</h4>
                  {notifications.length === 0 ? (
                    <p>ไม่มีการแจ้งเตือน</p>
                  ) : (
                    notifications.map((notification, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: notification.seen
                            ? "transparent"
                            : "#eaeaea",
                          display: "flex",
                          alignItems: "center",
                          padding: "10px",
                          borderRadius: "8px",
                          marginBottom: "0.5rem",
                          transition: "background-color 200ms ease",
                          cursor: "pointer",
                        }}
                        onClick={(e) => {
                          const entityId =
                            notification.blog?.blog_id || notification._id;
                          handleNotificationClick(
                            e,
                            notification.type,
                            notification._id,
                            entityId,
                            notification.user ? notification.user._id : null
                          );
                        }}
                      >
                        <img
                          src={
                            notification.type != "delete"
                              ? notification.user.profile_picture
                              : "https://www.svgrepo.com/show/116240/wrench-and-hammer-tools-thin-outline-symbol-inside-a-circle.svg"
                          }
                          alt={notification.type != "delete" ? "User" : "Admin"}
                          className="rounded-circle"
                          style={{
                            height: "40px",
                            width: "40px",
                            objectFit: "cover",
                            marginRight: "10px",
                          }}
                        />
                        <div style={{ flexGrow: 1 }}>
                          <p style={{ margin: 0, fontWeight: 500 }}>
                            {notification.type === "delete"
                              ? `บล็อกของคุณได้รับการตรวจสอบและถูกลบเนื่องจาก ${notification.reason}`
                              : notification.type === "follow"
                              ? `${notification.user.fullname} เริ่มติดตามคุณ`
                              : notification.type === "like"
                              ? `${notification.user.fullname} กดถูกใจบล็อกของคุณ`
                              : notification.type === "comment"
                              ? `${notification.user.fullname} แสดงความคิดเห็นบนบล็อกของคุณ`
                              : notification.type === "reply"
                              ? `${notification.user.fullname} ตอบกลับการแสดงความคิดเห็นของคุณ`
                              : `${notification.user.fullname} commented on your blog`}
                          </p>
                          <small style={{ color: "#888" }}>
                            {new Date(notification.createdAt).toLocaleString()}
                          </small>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                ""
              )}
            </div>

            <div
              className="relative"
              style={{ position: "relative" }}
              onClick={handleNavpanel}
              onBlur={handleBlur}
            >
              <button
                className=" mt-1"
                style={{ width: "3rem", height: "3rem" }}
              >
                <img
                  src={profile_picture}
                  className="img-fluid rounded-circle"
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </button>

              {userNavPanel ? <UserNavigationPanel /> : ""}
            </div>
          </>
        ) : (
          <>
            <Link
              className="btn-dark py-2"
              to="/signin"
              style={{ textDecoration: "none" }}
            >
              เข้าสู่ระบบ
            </Link>

            <Link
              className="btn-light py-2 hidden md:block"
              to="/signup"
              style={{ textDecoration: "none" }}
            >
              สมัครสมาชิก
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
