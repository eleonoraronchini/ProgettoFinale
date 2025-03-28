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
  const [showSuccessModal, setShowSuccessModal] = useState(false);  // State for success modal
  const [successMessage, setSuccessMessage] = useState("");  // Success message
  const navigate = useNavigate();

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
      setSuccessMessage("Account successfully deleted. Redirecting to login...");
      setShowSuccessModal(true);  // Show success modal
      localStorage.removeItem("token");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
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
      const response = await ApiService.updateProfile(userData);
  
      if (response && response.status === 200) {
        const updatedUser = await ApiService.myProfile();
        setUser(updatedUser.user);
        setSuccessMessage("Profile updated successfully!");
        setShowSuccessModal(true);  
      } else {
        setError("Error updating profile. Please try again later.");
      }
    } catch (error) {
      console.error("Complete error:", error);
  
      if (error.response) {
        setError(`Server error: ${error.response.status} - ${error.response.data?.message || "Unknown error"}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from the server. Please check your internet connection.");
      } else {
        // There was an error setting up the request
        setError(`Configuration error: ${error.message}`);
      }
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
                        style={{ borderRadius: 0 }}
                        variant="dark"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        Delete Account
                      </Button>
                      <Button
                        className="button-class"
                        onClick={handleSaveProfile}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </Form>

                  {/* Modal for Account Deletion */}
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
                        style={{ borderRadius: 0 }}
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

      {/* Modal for Success Messages */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
        className="text-dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>Ok!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-custom">
          {successMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ borderRadius: 0 }}
            variant="dark"
            onClick={() => setShowSuccessModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EditProfilePage;

