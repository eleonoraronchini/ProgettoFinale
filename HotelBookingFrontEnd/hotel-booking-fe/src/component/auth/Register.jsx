import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: ""
    });

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalVariant, setModalVariant] = useState("");  
    const navigate = useNavigate();

    const handleInputChange = ({ target: { name, value } }) =>
        setFormData((prev) => ({ ...prev, [name]: value }));

    const isFormValid = () => {
        return Object.values(formData).every((field) => field.trim()) && validateEmail(formData.email);
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            setModalMessage("Please fill all fields correctly and ensure the email is valid.");
            setModalVariant("danger");
            setShowModal(true);
            return;
        }
        try {
            const resp = await ApiService.registerUser(formData);
            if (resp.status === 200) {
                setModalMessage("User Registered successfully!");
                setModalVariant("success");
                setShowModal(true);
                setTimeout(() => navigate("/login"), 3000);
            }
        } catch (error) {
            if (error.response?.data?.message) {
                if (error.response.data.message.includes("duplicate key value violates unique constraint")) {
                    setModalMessage("The email is already in use. Please choose a different email.");
                } else if (error.response.data.message.includes("field 'email' must not be null")) {
                    setModalMessage("Email is required.");
                } else {
                    setModalMessage("An error occurred during registration. Please try again.");
                }
            } else {
                setModalMessage("An error occurred during registration.");
            }
            setModalVariant("danger");
            setShowModal(true);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center mt-3">
            <div className="auth-container" style={{ width: "400px" }}>
                <h2 className="text-center mb-4">Register</h2>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control 
                                className="form-color"
                                type="text"
                                placeholder="Enter first name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridLastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                className="form-color"
                                type="text"
                                placeholder="Enter last name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" controlId="formGridEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            className="form-color"
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            className="form-color"
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridPhoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            className="form-color"
                            type="text"
                            placeholder="Enter phone number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <div className="d-grid">
                        <Button className="button-class" variant="primary" type="submit">
                            Register
                        </Button>
                    </div>
                </Form>
                <p className="text-center mt-3">Already have an account? <a href="/login" className="text-warning">Login</a></p>
            </div>

            {/* Modal for success or error messages */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                
                
            >
                <Modal.Header closeButton>
                    <Modal.Title className="text-dark">{modalVariant === "success" ? "Success" : "Error"}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-dark">
                    {modalMessage}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="button-class" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Register;
