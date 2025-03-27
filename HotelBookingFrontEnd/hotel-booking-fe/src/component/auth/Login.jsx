import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { Modal } from 'react-bootstrap';

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showModal, setShowModal] = useState(false); 
    const [modalMessage, setModalMessage] = useState(""); 
    const [modalType, setModalType] = useState(""); 

    const navigate = useNavigate();
    const { state } = useLocation();
    const redirectPath = state?.from?.pathname || "/home";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        
        if (!email || !password) {
            setModalType("error");
            setModalMessage("Please fill all input fields");
            setShowModal(true);
            return;
        }

        try {
           
            const { status, token, role } = await ApiService.loginUser(formData);
            if (status === 200) {
                ApiService.saveToken(token);
                ApiService.saveRole(role);
                
                navigate(redirectPath, { replace: true });
            }
        } catch (error) {
            setModalType("error");
            setModalMessage(error.response?.data?.message || error.message);
            setShowModal(true);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center mt-5">
            <div className="auth-container" style={{ width: "400px" }}>
                <h2 className="text-center mb-4">Login</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formGridEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            className="form-color"
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            className="form-color"
                            type="password"
                            placeholder="Enter password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <div className="d-grid">
                        <Button variant="primary" className="button-class" type="submit">
                            Login
                        </Button>
                    </div>
                </Form>
                <p className="text-center mt-3">Don't have an account? <a href="/register" className="text-warning">Register</a></p>
            </div>

            {/* Modal per messaggi di errore */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered className="modal-custom">
                <Modal.Header closeButton>
                    <Modal.Title>{modalType === "error" ? "Error" : "Success"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{modalMessage}</p>
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

export default Login;
