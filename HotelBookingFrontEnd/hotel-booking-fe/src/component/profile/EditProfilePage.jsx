import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { Button, Form, Container, Row, Col, Card, Modal } from "react-bootstrap";

const EditProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // For success message
  const navigate = useNavigate();

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await ApiService.myProfile();
        setUser(response.user);
        setFirstName(response.user.firstName);
        setLastName(response.user.lastName);
        setEmail(response.user.email);
        setPhoneNumber(response.user.phoneNumber);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserProfile();
  }, []);

  const handleDeleteProfile = async () => {
    try {
      await ApiService.deleteAccount();
      alert("Account deleted!");
      localStorage.removeItem("token"); 
      navigate("/login"); 
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleSaveProfile = async () => {
    const userData = {
      firstName,
      lastName,
      email,
      phoneNumber,
    };

    try {
      // Update profile via API
      await ApiService.updateProfile(userData);

      // After successful update, fetch updated user data
      const updatedUser = await ApiService.myProfile();
      setUser(updatedUser.user);  // Update the user state with the latest data
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      setError("Failed to update profile. Please try again later.");
    }
  };

  return (
    <Container className="edit-profile-page my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header className="bg text-center text-dark">
              <h3>Edit Profile</h3>
            </Card.Header>
            <Card.Body>
              {error && <p className="text-danger">{error}</p>}
              {successMessage && <p className="text-success">{successMessage}</p>}
              {user && (
                <>
                  <Form>
                    <Form.Group className="mb-3" controlId="firstName">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="lastName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="phoneNumber">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                      <Button 
                        variant="dark" 
                        onClick={() => setShowDeleteModal(true)}
                      >
                        Delete Account
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={handleSaveProfile}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </Form>

                  <Modal
                    show={showDeleteModal}
                    onHide={() => setShowDeleteModal(false)}
                    centered
                    className="text-dark"
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Confirm Account Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-custom">
                      Are you sure you want to delete your account? This action cannot be undone.
                    </Modal.Body>
                    <Modal.Footer>
                      <Button 
                        className="button-class"
                        onClick={() => setShowDeleteModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        style={{borderRadius: 0}}
                        variant="dark" 
                        onClick={handleDeleteProfile}
                      >
                        Delete Permanently
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProfilePage;
