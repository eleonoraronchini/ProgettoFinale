import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { Button, Card, ListGroup, Container, Alert } from 'react-bootstrap';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const myProfileResponse = await ApiService.myProfile();
                setUser(myProfileResponse.user);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        };
        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        ApiService.logout();
        navigate("/home");
    };

    const handleEditProfile = () => {
        navigate("/edit-profile");
    };

    return (
        <div style={{
            backgroundColor:"white", 
            backgroundSize: "cover", 
            backgroundPosition: "center", 
            backgroundAttachment: "fixed", 
            minHeight: "100vh", 
            padding: "50px 0"
        }}>
            {/* Container con sfondo chiaro */}
            <Container>
                {error && <Alert variant="danger">{error}</Alert>}

                {user && (
                    <>
                        <h2 className="my-2 text-center" style={{
                            color: "#333", 
                            fontWeight: "600", 
                            fontSize: "2rem",
                            marginBottom: "30px"
                        }}>
                            Welcome, {user.firstName}
                        </h2>
                        <div className="profile-actions text-center mb-4">
                            <Button
                                className="button-class me-2"
                                onClick={handleEditProfile}
                                style={{
                                    
                                    color: "#fff", 
                                    padding: "10px 20px", 
                                    fontWeight: "500",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    marginBottom: "15px"
                                }}
                            >
                                Edit Profile
                            </Button>
                            <Button
                                variant="dark"
                                onClick={handleLogout}
                                className="ml-2"
                                style={{
                                    borderRadius: 0,
                                    backgroundColor: "dark", 
                                    borderColor: "#6c757d", 
                                    color: "#fff", 
                                    padding: "10px 20px", 
                                    fontWeight: "500",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    marginBottom: "15px"
                                }}
                            >
                                Logout
                            </Button>
                        </div>

                        <Card className="mt-4 shadow-lg" style={{
                            borderRadius: "15px",
                            overflow: "hidden",
                            borderColor: "#e0e0e0",
                            marginBottom: "30px"
                        }}>
                            <Card.Body style={{ padding: "30px" }}>
                                <Card.Title style={{
                                    fontSize: "1.8rem", 
                                    fontWeight: "500", 
                                    color: "#333", 
                                    marginBottom: "20px"
                                }}>
                                    My Profile Details
                                </Card.Title>
                                <ListGroup variant="flush" style={{ fontSize: "1.1rem" }}>
                                    <ListGroup.Item><strong>Email:</strong> {user.email}</ListGroup.Item>
                                    <ListGroup.Item><strong>Phone number:</strong> {user.phoneNumber}</ListGroup.Item>
                                    <ListGroup.Item><strong>First name:</strong> {user.firstName}</ListGroup.Item>
                                    <ListGroup.Item><strong>Last name:</strong> {user.lastName}</ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </>
                )}
            </Container>
        </div>
    );
};

export default ProfilePage;

