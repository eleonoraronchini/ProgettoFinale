import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const AdminRegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        role: ""
    });

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
            toast.error("Complete all fields and enter a valid email.");
            return;
        }

        try {

            const response = await ApiService.myProfile();
            console.log("Current user profile:", response);
            
            if (response?.user?.role !== "ADMIN") {
                toast.error("Unauthorized: admin-only page");
                return;
            }

            
            const resp = await ApiService.registerUser(formData);
            if (resp.status === 200) {
                toast.success("User successfully registered!");
                setTimeout(() => navigate("/login"), 3000); 
            }
        } catch (error) {
            console.error("Error during registration:", error);
            
            if (error.response?.data?.message) {
                if (error.response.data.message.includes("duplicate key value violates unique constraint")) {
                    toast.error("Email already in use. Please choose a different email.");
                } else if (error.response.data.message.includes("field 'email' must not be null")) {
                    toast.error("Email is required.");
                } else {
                    toast.error("An error occurred during registration. Please try again.");
                }
            } else {
                toast.error("An error occurred during registration.");
            }
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center mt-3">
            <div className="auth-container" style={{ width: "400px" }}>
                <h2 className="text-center mb-4">Registrazione Admin</h2>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridFirstName">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control 
                                className="form-color"
                                type="text"
                                placeholder="Enter name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridLastName">
                            <Form.Label>Cognome</Form.Label>
                            <Form.Control
                                className="form-color"
                                type="text"
                                placeholder="Enter lastname"
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
                        <Form.Label>Numero di Telefono</Form.Label>
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

                    <Form.Group className="mb-3" controlId="formGridRole">
                        <Form.Label>Ruolo</Form.Label>
                        <Form.Control
                            className="form-color"
                            type="text"
                            placeholder="Enter role (ADMIN o CUSTOMER)"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>

                    <div className="d-grid">
                        <Button className="button-class" variant="primary" type="submit">
                            Register Admin
                        </Button>
                    </div>
                </Form>
                <p className="text-center mt-3">Already have an account? <a href="/login" className="text-warning">Login</a></p>
            </div>

            {/* ToastContainer per le notifiche */}
            <ToastContainer 
                position="top-right" 
                autoClose={5000} 
                hideProgressBar={true} 
                newestOnTop={true} 
                closeOnClick 
                rtl={false} 
                pauseOnFocusLoss 
                draggable 
                pauseOnHover 
            />
        </Container>
    );
};

export default AdminRegisterPage;