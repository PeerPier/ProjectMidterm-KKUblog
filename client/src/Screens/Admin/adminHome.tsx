import "../../misc/adminHome.css";
import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import logostart from "../../pic/logo-headV2.png";
import { RxHamburgerMenu } from "react-icons/rx";
import { TiDocumentText } from "react-icons/ti";
import { RiDashboardFill } from "react-icons/ri";
import { IoIosHelpCircle, IoIosTime } from "react-icons/io";
import { MdManageAccounts, MdCategory, MdOutlinePostAdd } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import {
  fetchAdminProfile,
  fetchAllBlog,
  fetchAllUser,
  fetchUser,
  fetchUsersAPI,
  fetchViews,
} from "../../api/adminProfile";
import { LuView } from "react-icons/lu";
import { PiUsersThreeFill } from "react-icons/pi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import Pro from "../../pic/start1.jpg";
import { RiUserStarFill } from "react-icons/ri";
import Form from "react-bootstrap/Form";
import ManageUser from "./manageUs";
import GrowthChart from "./Chart/GrowthChart";
import { IoNotifications } from "react-icons/io5";
import { FaUserMinus } from "react-icons/fa6";
import ManageCate from "./manageCate";
import ManageQ from "./manageQ";
import axios from "axios";
import ReportDetailsModal from "./approve-modal";
import { Button } from "react-bootstrap";
import { Line } from "react-chartjs-2"; // ใช้แสดงกราฟ Line
import "chart.js/auto"; // สำหรับการใช้งาน Chart.js

export interface Report {
  _id: string;
  reason: string;
  verified: boolean;
  status: string;
  createdAt: string;
  reportedBy: {
    _id: string;
    fullname: string;
  };
  post: {
    _id: string;
    author: {
      _id: string;
      fullname: string;
      banner: string;
      profile_picture: string;
    };
    content: [
      {
        time: number;
        blocks: [
          {
            id: string;
            type: string;
            data: {
              text: string;
            };
          }
        ];
        version: string;
      }
    ];
    image: string;
    topic: string;
    detail: string;
    tags: string[];
    banner: string;
    publishedAt: string;
    contentWithImages: {
      content: string;
      images?: string[];
    }[];
  };
}

interface MonthData {
  month: string;
  publishedAt: number;
}

const transformData = (data: any[]): MonthData[] => {
  // Create an array for the months
  const monthsPost: MonthData[] = [
    { month: "January", publishedAt: 0 },
    { month: "February", publishedAt: 0 },
    { month: "March", publishedAt: 0 },
    { month: "April", publishedAt: 0 },
    { month: "May", publishedAt: 0 },
    { month: "June", publishedAt: 0 },
    { month: "July", publishedAt: 0 },
    { month: "August", publishedAt: 0 },
    { month: "September", publishedAt: 0 },
    { month: "October", publishedAt: 0 },
    { month: "November", publishedAt: 0 },
    { month: "December", publishedAt: 0 },
  ];

  // Iterate over the input data
  data.forEach((item) => {
    const monthIndex = new Date(Date.parse(item.month + " 1, 2024")).getMonth();
    if (monthIndex >= 0 && monthIndex < 12) {
      monthsPost[monthIndex].publishedAt += item.total_reads; // Sum up total_reads for each month
    }
  });

  return monthsPost;
};

const AdminHome: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const API_BASE_URL = process.env.REACT_APP_API_ENDPOINT;
  const adminUsername = sessionStorage.getItem("userId");

  const [adminProfile, setAdminProfile] = useState<any>(true);
  const [userCounter, setUserCounter] = useState<number>(0);
  const [postCounter, setPostCounter] = useState<number>(0);
  const [totalViews, setTotalViews] = useState<number>(0);
  const [getUser, setGetUser] = useState<any>();
  const [getBlog, setGetBlog] = useState<any>();
  const [getView, setGetView] = useState<any>();

  const [selectedCate, setSelectedCate] = useState<string>("dashboard");
  const [selectedBlog, setSelectedBlog] = useState<string>("blog-all");
  const [selectedApprove, setSelectedApprove] =
    useState<string>("blog-success");

  const [reports, setReports] = useState<Report[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [users, setUsers] = useState<any>([]);
  const [allUsers, setAllUsers] = useState<any>([]);
  const [monthsPost, setMonthsPost] = useState<MonthData[]>([]);

  const handleShowModal = (report: any) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/report`);
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseUser = await axios.get(
          `${API_BASE_URL}/profile/within24hour`
        );
        const responseAllUser = await axios.get(`${API_BASE_URL}/profile`);
        setUsers(responseUser.data);
        setAllUsers(responseAllUser.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const sideMenu = document.querySelector("aside");
    const menuBtn = document.querySelector("#menu-btn");
    const closeBtn = document.querySelector("#close");
    const themToggler = document.querySelector(".theme-toggler");

    if (menuBtn && closeBtn && sideMenu && themToggler) {
      const openMenuHandler = () => {
        sideMenu.style.display = "block";
      };

      const closeMenuHandler = () => {
        sideMenu.style.display = "none";
      };

      const changeTheme = () => {
        document.body.classList.toggle("dark-theme-variables");

        themToggler
          ?.querySelector("svg:nth-child(1)")
          ?.classList.toggle("active");
        themToggler
          ?.querySelector("svg:nth-child(2)")
          ?.classList.toggle("active");
      };

      themToggler.addEventListener("click", changeTheme);
      menuBtn.addEventListener("click", openMenuHandler);
      closeBtn.addEventListener("click", closeMenuHandler);

      return () => {
        themToggler.removeEventListener("click", changeTheme);
        menuBtn.removeEventListener("click", openMenuHandler);
        closeBtn.removeEventListener("click", closeMenuHandler);
      };
    }
  }, [selectedCate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const profileData = await fetchAdminProfile(id);
          setAdminProfile(profileData);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userCountData = await fetchUsersAPI();
        const AllPost = await fetchAllBlog();
        const blog = await fetchAllUser();
        const User = await fetchUser();
        const view = await fetchViews();
        const totalViews = view.reduce(
          (acc: any, post: any) => acc + post.total_reads,
          0
        );
        setGetUser(User);
        setGetBlog(blog);
        setUserCounter(userCountData);
        setPostCounter(blog.length);
        setTotalViews(totalViews);
        const transformedData = transformData(view);
        setMonthsPost(transformedData);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchData();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/report`);
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/views`);
        setGetView(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchViews();
  }, []);

  const handleCategorySelection = (category: string) => {
    setSelectedCate(category);
  };

  const handleTableSelection = (Table: string) => {
    setSelectedBlog(Table);
  };

  const refreshReports = () => {
    fetchReports();
  };

  const countVerifiedReports = (reports: Report[]): number => {
    return reports.reduce(
      (count, report) => (!report.verified ? count + 1 : count),
      0
    );
  };

  const countNoVerifiedReports = (reports: Report[]): number => {
    return reports.reduce(
      (count, report) => (report.verified ? count + 1 : count),
      0
    );
  };

  // สถานะเพื่อจัดการการ hover สำหรับ user-all และ view-all
  const [isUserHovered, setIsUserHovered] = useState(false);
  const [isViewHovered, setIsViewHovered] = useState(false);
  const [monthsUser, setMonthsUser] = useState([
    { month: "January", joinAt: 0 },
    { month: "February", joinAt: 0 },
    { month: "March", joinAt: 0 },
    { month: "April", joinAt: 0 },
    { month: "May", joinAt: 0 },
    { month: "June", joinAt: 0 },
    { month: "July", joinAt: 0 },
    { month: "August", joinAt: 0 },
    { month: "September", joinAt: 0 },
    { month: "October", joinAt: 0 },
    { month: "November", joinAt: 0 },
    { month: "December", joinAt: 0 },
  ]);

  useEffect(() => {
    if (getUser && getUser.length > 0) {
      const updatedMonthsUser = [...monthsUser];
      getUser.forEach((user: any) => {
        const date = new Date(user.joinedAt);
        const monthIndex = date.getUTCMonth();
        updatedMonthsUser[monthIndex].joinAt += 1;
      });
      setMonthsUser(updatedMonthsUser);
    }
  }, [getUser]);

  // ข้อมูลตัวอย่างสำหรับกราฟ
  const userData = {
    labels: monthsUser.map((e) => e.month),
    datasets: [
      {
        label: "จำนวนผู้ใช้",
        data: monthsUser?.map((e) => e.joinAt), // ข้อมูลกราฟ
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };
  // ข้อมูลตัวอย่างสำหรับกราฟของการเยี่ยมชม
  const viewData = {
    labels: monthsPost.map((e) => e.month),
    datasets: [
      {
        label: "จำนวนการเยี่ยมชม",
        data: monthsPost.map((e) => e.publishedAt), // ข้อมูลกราฟการเยี่ยมชม
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="adminHome">
      <div className="contain">
        <aside>
          <div className="top">
            <div className="logo">
              <img src={logostart} alt="" />
            </div>
            <div id="close">
              <AiOutlineClose />
            </div>
          </div>

          <div className="sidebar">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleCategorySelection("dashboard");
              }}
              className={selectedCate === "dashboard" ? "active" : ""}
            >
              <RiDashboardFill />
              <h3>Dashboard</h3>
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleCategorySelection("average");
              }}
              className={selectedCate === "average" ? "active" : ""}
            >
              <TiDocumentText />
              <h3>จัดการบล็อก</h3>
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleCategorySelection("manage-q");
              }}
              className={selectedCate === "manage-q" ? "active" : ""}
            >
              <IoIosHelpCircle />
              <h3>จัดการคำถาม</h3>
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleCategorySelection("manage-user");
              }}
              className={selectedCate === "manage-user" ? "active" : ""}
            >
              <MdManageAccounts />
              <h3>จัดการบัญชีผู้ใช้</h3>
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleCategorySelection("manage-cate");
              }}
              className={selectedCate === "manage-cate" ? "active" : ""}
            >
              <MdCategory />
              <h3>จัดการหมวดหมู่</h3>
            </a>
            <Link to={`/admin/login`}>
              <FiLogOut />
              <h3>ออกจากระบบ</h3>
            </Link>
          </div>
        </aside>

        {selectedCate === "dashboard" && (
          <div className="main1">
            <h1>Dashboard</h1>

            <div className="date">
              <input type="date" />
            </div>

            <div className="insights">
              <div
                className="user-all"
                onMouseEnter={() => setIsUserHovered(true)} // เมื่อเมาส์เข้า
                onMouseLeave={() => setIsUserHovered(false)} // เมื่อเมาส์ออก
                style={{ position: "relative" }} // เพื่อให้กราฟอยู่บน div
              >
                <PiUsersThreeFill className="svg1" />
                <div className="middle">
                  <div className="left">
                    <h3>ผู้ใช้ทั้งหมด</h3>
                    <h1>{userCounter}</h1>
                  </div>
                </div>

                {/* แสดงกราฟเมื่อ hover บน user-all */}
                {isUserHovered && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      padding: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      zIndex: 10,
                      width: "300px",
                    }}
                  >
                    <Line data={userData} options={options} />
                  </div>
                )}
              </div>

              {/* ส่วนของ view-all */}
              <div
                className="view-all"
                onMouseEnter={() => setIsViewHovered(true)} // เมื่อเมาส์เข้า
                onMouseLeave={() => setIsViewHovered(false)} // เมื่อเมาส์ออก
                style={{ position: "relative" }} // เพื่อให้กราฟอยู่บน div
              >
                <LuView className="svg2" />
                <div className="middle">
                  <div className="left">
                    <h3>การเยี่ยมชม</h3>
                    <h1>{totalViews}</h1>
                  </div>
                </div>

                {/* แสดงกราฟเมื่อ hover บน view-all */}
                {isViewHovered && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      padding: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      zIndex: 10,
                      width: "300px",
                    }}
                  >
                    <Line data={viewData} options={options} />
                  </div>
                )}
              </div>

              <div className="blogpost-all">
                <IoDocumentTextOutline className="svg3" />
                <div className="middle">
                  <div className="left">
                    <h3>บล็อกทั้งหมด</h3>
                    <h1>{postCounter}</h1>
                  </div>
                </div>
              </div>
            </div>

            <div className="recent-order">
              <GrowthChart data={getBlog} />
            </div>
          </div>
        )}
        {selectedCate === "dashboard" && (
          <div className="right">
            <div className="top">
              <button id="menu-btn">
                <RxHamburgerMenu />
              </button>
              <div className="theme-toggler">
                <MdLightMode className="active" />
                <MdDarkMode />
              </div>

              {adminProfile && (
                <div className="profile">
                  <div className="info">
                    <p>
                      Hello, <b>{adminUsername}</b>
                    </p>
                    <small className="text-muted1">{adminUsername}</small>
                  </div>
                  <div className="profile-photo">
                    <img src={Pro} alt="" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedCate === "average" && (
          <div className="average">
            <div className="main1">
              <h1>จัดการบล็อก</h1>
              <div className="insights">
                <div
                  className="blogpost-all"
                  onClick={(e) => {
                    e.preventDefault();
                    handleTableSelection("blog-all");
                  }}
                >
                  <IoDocumentTextOutline className="svg3" />
                  <div className="middle">
                    <div className="left">
                      <h3>บล็อกที่รายงานทั้งหมด</h3>
                      <h1>{reports.length}</h1>
                    </div>
                  </div>
                </div>
                <div
                  className="view-all"
                  onClick={(e) => {
                    e.preventDefault();
                    handleTableSelection("blog-wait");
                  }}
                >
                  <IoIosTime className="svg2" />
                  <div className="middle">
                    <div className="left">
                      <h3>รอตรวจสอบ</h3>
                      <h1>{countVerifiedReports(reports)}</h1>
                    </div>
                  </div>
                </div>

                <div
                  className="user-all"
                  onClick={(e) => {
                    e.preventDefault();
                    handleTableSelection("blog-success");
                  }}
                >
                  <PiUsersThreeFill className="svg1" />
                  <div className="middle">
                    <div className="left">
                      <h3>ตรวจสอบแล้ว</h3>
                      <h1>{countNoVerifiedReports(reports)}</h1>
                    </div>
                  </div>
                </div>
              </div>

              <h2
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "800",
                  marginTop: "2rem",
                }}
              >
                รายการ
              </h2>
              {selectedBlog === "blog-all" && (
  <div
    className="recent-order"
    style={{
      overflowY: "auto",  // เพิ่ม scrollbar เมื่อเนื้อหามากเกินไป
      maxHeight: "400px",  // กำหนดความสูงสูงสุดของ div
      margin: "0",
      borderRadius: "2rem",
    }}
  >
    <table>
      <thead className="pt-5">
        <tr>
          <th>ชื่อบัญชีผู้ใช้</th>
          <th>วันที่</th>
          <th>หัวข้อการรายงาน</th>
          <th>สถานะ</th>
          <th>รายละเอียด</th>
        </tr>
      </thead>
      {adminProfile && (
        <tbody>
          {reports.length > 0 ? (
            reports.map((report) => (
              <tr key={report._id}>
                <td>
                  {report.reportedBy ? report.reportedBy.fullname : ""}
                </td>
                <td>
                  {new Date(report.createdAt).toLocaleDateString()}
                </td>
                <td>{report.reason || "No Title"}</td>
                <td className="warning">{report.status}</td>
                <td className="primary">
                  <Button
                    variant="info"
                    onClick={() => handleShowModal(report)}
                    disabled={report.status !== "Pending"}
                  >
                    รายละเอียด
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>ไม่มีการรายงาน</td>
            </tr>
          )}
        </tbody>
      )}
    </table>

                  {/* Report Details Modal */}
                  {selectedReport && (
                    <ReportDetailsModal
                      showModal={showModal}
                      handleClose={handleCloseModal}
                      report={selectedReport}
                      refreshReports={refreshReports}
                    />
                  )}
                </div>
              )}

              {selectedBlog === "blog-wait" && (
                <div
                  className="recent-order"
                  style={{
                    overflowY: "scroll",
                    maxHeight: "400px",
                    margin: "0",
                    borderRadius: "2rem",
                  }}
                >
                  <table>
                    <thead className="pt-5">
                      <tr>
                        <th>ชื่อบัญชีผู้ใช้</th>
                        <th>วันที่</th>
                        <th>หัวข้อการรายงาน</th>
                        <th>สถานะ</th>
                        <th>รายละเอียด</th>
                      </tr>
                    </thead>
                    {adminProfile && (
                      <tbody>
                        {reports.length > 0 ? (
                          reports.map((report) =>
                            !report.verified ? (
                              <tr key={report._id}>
                                <td>
                                  {report.reportedBy
                                    ? report.reportedBy.fullname
                                    : ""}
                                </td>
                                <td>
                                  {new Date(
                                    report.createdAt
                                  ).toLocaleDateString()}
                                </td>
                                <td>{report.reason || "No Title"}</td>
                                <td className="warning">{report.status}</td>
                                <td className="primary">
                                  <Button
                                    variant="info"
                                    onClick={() => handleShowModal(report)}
                                    disabled={report.verified ? true : false}
                                  >
                                    รายละเอียด
                                  </Button>
                                </td>
                              </tr>
                            ) : (
                              <></>
                            )
                          )
                        ) : (
                          <tr>
                            <td colSpan={5}>ไม่มีการรายงาน</td>
                          </tr>
                        )}
                      </tbody>
                    )}
                  </table>
                  {/* Report Details Modal */}
                  {selectedReport && (
                    <ReportDetailsModal
                      showModal={showModal}
                      handleClose={handleCloseModal}
                      report={selectedReport}
                      refreshReports={refreshReports}
                    />
                  )}
                </div>
              )}

              {selectedBlog === "blog-success" && (
                <div
                  className="recent-order"
                  style={{
                    overflowY: "scroll",
                    maxHeight: "400px",
                    margin: "0",
                    borderRadius: "2rem",
                  }}
                >
                  <div
                    className="selectBlogCate"
                    style={{
                      marginLeft: "2rem",
                      position: "fixed",
                    }}
                  >
                    <Form>
                      {["radio"].map((type) => (
                        <div key={`inline-${type}`}>
                          <Form.Check
                            inline
                            label="Approve"
                            style={{ color: "#41f1b6" }}
                            name="group1"
                            type="radio"
                            id={`inline-${type}-1`}
                            onChange={() => setSelectedApprove("blog-success")}
                            checked={selectedApprove === "blog-success"}
                          />
                          <Form.Check
                            inline
                            label="Decline"
                            style={{ color: "#ff7782" }}
                            name="group1"
                            type="radio"
                            id={`inline-${type}-2`}
                            onChange={() => setSelectedApprove("blog-decline")}
                            checked={selectedApprove === "blog-decline"}
                          />
                        </div>
                      ))}
                    </Form>
                  </div>
                  <div>
                    {selectedApprove === "blog-success" && (
                      <table>
                        <thead className="pt-5">
                          <tr>
                            <th>ชื่อบัญชีผู้ใช้</th>
                            <th>วันที่</th>
                            <th>หัวข้อการรายงาน</th>
                            <th>สถานะ</th>
                            <th>รายละเอียด</th>
                          </tr>
                        </thead>
                        {adminProfile && (
                          <tbody>
                            {reports.length > 0 ? (
                              reports.map((report) =>
                                report.verified &&
                                report.status === "Approved" ? (
                                  <tr key={report._id}>
                                    <td>
                                      {report.reportedBy
                                        ? report.reportedBy.fullname
                                        : ""}
                                    </td>
                                    <td>
                                      {new Date(
                                        report.createdAt
                                      ).toLocaleDateString()}
                                    </td>
                                    <td>{report.reason || "No Title"}</td>
                                    <td className="warning">{report.status}</td>
                                    <td className="primary">
                                      <Button
                                        variant="info"
                                        onClick={() => handleShowModal(report)}
                                        disabled={
                                          report.verified ? true : false
                                        }
                                      >
                                        รายละเอียด
                                      </Button>
                                    </td>
                                  </tr>
                                ) : (
                                  <></>
                                )
                              )
                            ) : (
                              <tr>
                                <td colSpan={5}>ไม่มีการรายงาน</td>
                              </tr>
                            )}
                          </tbody>
                        )}
                      </table>
                    )}
                  </div>

                  {selectedApprove === "blog-decline" && (
                    <table>
                      <thead className="pt-5">
                        <tr>
                          <th>ชื่อผู้ใช้</th>
                          <th>วันที่</th>
                          <th>หัวข้อการรายงาน</th>
                          <th>สถานะ</th>
                          <th>รายละเอียด</th>
                        </tr>
                      </thead>
                      {adminProfile && (
                        <tbody>
                          {reports.length > 0 ? (
                            reports.map((report) =>
                              report.status === "Declined" ? (
                                <tr key={report._id}>
                                  <td>
                                    {report.reportedBy
                                      ? report.reportedBy.fullname
                                      : ""}
                                  </td>
                                  <td>
                                    {new Date(
                                      report.createdAt
                                    ).toLocaleDateString()}
                                  </td>
                                  <td>{report.reason || "No Title"}</td>
                                  <td className="warning">{report.status}</td>
                                  <td className="primary">
                                    <Button
                                      variant="info"
                                      onClick={() => handleShowModal(report)}
                                      disabled={report.verified ? true : false}
                                    >
                                      รายละเอียด
                                    </Button>
                                  </td>
                                </tr>
                              ) : (
                                <></>
                              )
                            )
                          ) : (
                            <tr>
                              <td colSpan={5}>ไม่มีการรายงาน</td>
                            </tr>
                          )}
                        </tbody>
                      )}
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {selectedCate === "average" && (
          <div className="right">
            <div className="top">
              <button id="menu-btn">
                <RxHamburgerMenu />
              </button>
              <div className="theme-toggler">
                <MdLightMode className="active" />
                <MdDarkMode />
              </div>

              {adminProfile && (
                <div className="profile">
                  <div className="info">
                    <p>
                      Hello, <b>{adminUsername}</b>
                    </p>
                    <small className="text-muted1">{adminUsername}</small>
                  </div>
                  <div className="profile-photo">
                    <img src={Pro} alt="" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {selectedCate === "manage-user" && (
          <ManageUser users={users} allUsers={allUsers} />
        )}
        {selectedCate === "manage-user" && (
          <div className="right">
            <div className="top">
              <button id="menu-btn">
                <RxHamburgerMenu />
              </button>

              {adminProfile && (
                <div className="profile">
                  <div className="info">
                    <p>
                      Hello, <b>{adminUsername}</b>
                    </p>
                    <small className="text-muted1">{adminUsername}</small>
                  </div>
                  <div className="profile-photo">
                    <img src={Pro} alt="" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedCate === "manage-q" && <ManageQ />}

        {selectedCate === "manage-q" && (
          <div className="right">
            <div className="top">
              <button id="menu-btn">
                <RxHamburgerMenu />
              </button>
              <div className="theme-toggler">
                <MdLightMode className="active" />
                <MdDarkMode />
              </div>

              {adminProfile && (
                <div className="profile">
                  <div className="info">
                    <p>
                      Hello, <b>{adminUsername}</b>
                    </p>
                    <small className="text-muted1">{adminUsername}</small>
                  </div>
                  <div className="profile-photo">
                    <img src={Pro} alt="" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedCate === "manage-cate" && <ManageCate blogsData={getBlog} />}
        {selectedCate === "manage-cate" && (
          <div className="right">
            <div className="top">
              <button id="menu-btn">
                <RxHamburgerMenu />
              </button>
              <div className="theme-toggler">
                <MdLightMode className="active" />
                <MdDarkMode />
              </div>

              {adminProfile && (
                <div className="profile">
                  <div className="info">
                    <p>
                      Hello, <b>{adminUsername}</b>
                    </p>
                    <small className="text-muted1">{adminUsername}</small>
                  </div>
                  <div className="profile-photo">
                    <img src={Pro} alt="" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
