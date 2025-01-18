import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const DeleteAdminAccountModal: React.FC<{
  userId: string | null;
  show: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
}> = ({ userId, show, onClose, onDeleteSuccess }) => {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_ENDPOINT;
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/profile/edit-profile/delete/${userId}`,
        {
          data: { password },
        }
      );

      if (response.data.message === "User deleted successfully") {
        setSuccessMessage("Account deleted successfully!");
        setErrorMessage("");
        onDeleteSuccess();
      } else {
        setErrorMessage(response.data.error);
      }
    } catch (error) {
      setErrorMessage("Error deleting account. Please check your password.");
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>ลบบัญชีผู้ใช้</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีของคุณ</p>
        <Form>
          <Form.Group controlId="password">
            <Form.Label>กรอกรหัสผ่านของคุณเพื่อยืนยัน</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          {successMessage && <p className="text-success">{successMessage}</p>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          ยกเลิก
        </Button>
        <Button variant="danger" onClick={handleDeleteAccount}>
          ยืนยัน
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteAdminAccountModal;
