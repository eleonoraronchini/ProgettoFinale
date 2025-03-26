import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

const AdminPage = () => {
    const [adminName, setAdminName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminName = async () => {
            try {
                const resp = await ApiService.myProfile();
                if (resp.user && resp.user.firstName) {
                    setAdminName(resp.user.firstName);
                } else {
                    setError("No user data found");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                setError(error.message);
                // Reindirizza al login se non autorizzato
                if (error.response?.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchAdminName();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{
            backgroundImage: "url('../../../images/office.jpg')", 
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            minHeight: "100vh",
        }}>
            <Container
                fluid
                className="d-flex flex-column justify-content-center align-items-center p-4"
                style={{ minHeight: '80vh' }} 
            >
                <Row className="justify-content-center w-100">
                    <Col md={8} lg={6} xl={4}>
                        <Card className="text-center shadow-lg rounded-4 p-4">
                            <Card.Body>
                                <Card.Title className="mb-4 text-dark fs-3">
                                    Welcome, {adminName || "Admin"}
                                </Card.Title>
                                <div className="admin-actions">
                                    <Button
                                        variant="dark"
                                        className="w-100 mb-3 py-3"
                                        onClick={() => navigate("/admin/manage-rooms")}
                                    >
                                        Manage Rooms
                                    </Button>
                                    <Button
                                        variant="dark"
                                        className="w-100 py-3"
                                        onClick={() => navigate("/admin/manage-bookings")}
                                    >
                                        Manage Bookings
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AdminPage;