import React, { useState, useEffect } from "react";
import { PiUsersThreeFill } from "react-icons/pi";
import { LuView } from "react-icons/lu";
import { updateUserAPI } from "../../api/adminProfile";
import { useNavigate, useParams } from "react-router-dom";
import GenderChart from "./Chart/GenderChart";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import eye icons
import DeleteAccountModal from "../DeleteAccount-confirm";
import DeleteAdminAccountModal from "./adminDelete-account";

interface UserProps {
  users: any[];
  allUsers: any[];
}

const ManageUser: React.FC<UserProps> = ({ users, allUsers }) => {
  const { id } = useParams<{ id: string }>();
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [fetchUserData, setFetchUserData] = useState<any>([]);

  const [passwordVisibility, setPasswordVisibility] = useState<{
    [key: string]: boolean;
  }>({});

  const API_BASE_URL = process.env.REACT_APP_API_ENDPOINT;
  const navigate = useNavigate();

  const genderData = {
    male: 30,
    female: 20
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setFullname(user.fullname);
    setEmail(user.email);
    setShowEditModal(true);
  };

  const handleDeleteUser = async (userId: string) => {
    setSelectedUser(userId);
    setShowDeleteModal(true);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setFullname("");
    setEmail("");
    setSelectedUser(null);
  };

  const handleUpdateUser = async () => {
    try {
      await updateUserAPI(selectedUser._id, fullname, email);
      setShowEditModal(false);
      fetchUsers();
    } catch (error: any) {
      if (error.message.includes("Email is already in use.")) {
        alert("This email is already in use. Please choose another one.");
      } else {
        console.error("Failed to update user:", error);
      }
    }
  };

  // Function to toggle password visibility for a specific user
  const togglePasswordVisibility = (userId: string) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false);
    fetchUsers();
    alert("Your account has been deleted.");
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile`);
      setFetchUserData(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  return (
    <div className="manageUser">
      <div className="main1">
        <h1>จัดการบัญชีผู้ใช้</h1>

        <div className="insights">
          <div className="user-all">
            <PiUsersThreeFill className="svg1" />
            <div className="middle">
              <div className="left">
                <h3>ผู้ใช้ทั้งหมด</h3>
                <h1>{allUsers.length}</h1>
              </div>
            </div>
          </div>

          <div className="view-all">
            <LuView className="svg2" />
            <div className="middle">
              <div className="left">
                <h3>ผู้ใช้ใหม่</h3>
                <h1>{users.length}</h1>
              </div>
            </div>
           
          </div>

          <div className="blogpost-all">
            <div className="middle">
              <GenderChart data={genderData} />
            </div>
          </div>
        </div>

        <div className="recent-order" style={{ marginTop: "1.5rem" }}>
          <h2>รายการ</h2>
          <div className="right">
            <div
              className="activity-analytics"
              style={{
                marginTop: "0.5rem",
                overflowY: "scroll",
                maxHeight: "300px"
              }}
            >
              <table>
                <thead className="pt-5">
                  <tr>
                    <th>วันที่</th>
                    <th>ชื่อบัญชีผู้ใช้</th>
                    <th>อีเมล</th>
                    <th>รหัสผ่าน</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.length > 0 ? (
                    fetchUserData.length > 0 ? (
                      fetchUserData.map((u: any) => (
                        <tr key={u._id}>
                          <td>{new Date(u.joinedAt).toLocaleDateString()}</td>
                          <td>{u.fullname}</td>
                          <td>{u.email}</td>
                          <td className="warning">
                            <span>{passwordVisibility[u._id] ? u.password : "*****"}</span>
                            <button
                              onClick={() => togglePasswordVisibility(u._id)}
                              style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer"
                              }}
                            >
                              {passwordVisibility[u._id] ? <AiFillEyeInvisible /> : <AiFillEye />}
                            </button>
                          </td>
                          <td className="primary">
                            <Button onClick={() => handleEditUser(u)}>Edit</Button>
                          </td>
                          <td>
                            <Button onClick={() => handleDeleteUser(u._id)}>Delete</Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      allUsers.map((u: any) => (
                        <tr key={u._id}>
                          <td>{new Date(u.joinedAt).toLocaleDateString()}</td>
                          <td>{u.fullname}</td>
                          <td>{u.email}</td>
                          <td className="warning">
                            <span>{passwordVisibility[u._id] ? u.password : "*****"}</span>
                            <button
                              onClick={() => togglePasswordVisibility(u._id)}
                              style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer"
                              }}
                            >
                              {passwordVisibility[u._id] ? <AiFillEyeInvisible /> : <AiFillEye />}
                            </button>
                          </td>
                          <td className="primary">
                            <Button
                              disabled={u.google_auth ? true : false}
                              onClick={() => handleEditUser(u)}
                            >
                              แก้ไข
                            </Button>
                          </td>
                          <td>
                            <Button
                              disabled={u.google_auth ? true : false}
                              onClick={() => handleDeleteUser(u._id)}
                            >
                              ลบ
                            </Button>
                          </td>
                        </tr>
                      ))
                    )
                  ) : (
                    <tr>
                      <td colSpan={5}>ไม่มีรายงาน</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showEditModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>แก้ไขบัญชีผู้ใช้</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFullname">
              <Form.Label>ชื่อ</Form.Label>
              <Form.Control
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>อีเมล</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            ปิด
          </Button>
          <Button variant="primary" onClick={handleUpdateUser}>
            บันทึกการเปลี่ยนแปลง
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete User Modal */}
      <DeleteAdminAccountModal
        userId={selectedUser}
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  );
};

export default ManageUser;
