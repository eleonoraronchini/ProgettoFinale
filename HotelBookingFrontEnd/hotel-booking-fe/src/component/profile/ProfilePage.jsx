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
        <Container className="profile-page">
            {error && <Alert variant="danger">{error}</Alert>}

            {user && (
                <>
                    <h2 className="my-2">Welcome, {user.firstName}</h2>
                    <div className="profile-actions">
                        <Button className="button-class me-2" onClick={handleEditProfile}>Edit Profile</Button>
                        <Button variant="secondary" onClick={handleLogout} className="ml-2">Logout</Button>
                    </div>
                    
                    <Card className="mt-4">
                        <Card.Body>
                            <Card.Title>My Profile Details</Card.Title>
                            <ListGroup variant="flush">
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
    );
};

export default ProfilePage;
