import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

const AdminPage = () => {
    const [adminName, setAdminName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminName = async () => {
            try {
                const resp = await ApiService.myProfile();
                setAdminName(resp.user.firstName);
                // Naviga alla pagina di gestione (puoi sostituire con /admin)
                navigate("/admin");
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchAdminName();
    }, [navigate]);

    return (
        <Container
            fluid
            className="d-flex flex-column justify-content-center align-items-center p-4"
            style={{ minHeight: '80vh' }} // Ridotto per non avere troppo spazio sopra
        >
            <Row className="justify-content-center w-100">
                <Col md={8} lg={6} xl={4}>
                    <Card className="text-center shadow-lg rounded-4 p-4 background-color">
                        <Card.Body className="bg-dark">
                            <Card.Title className="mb-4 text-dark fs-3">
                                Welcome, {adminName}
                            </Card.Title>
                            <div className="admin-actions">
                                <Button
                                    className="button-class w-100 mb-3 py-3"
                                    onClick={() => navigate("/admin/manage-rooms")}
                                >
                                    Manage Rooms
                                </Button>
                                <Button
                                    className="button-class w-100 py-3"
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
    );
};

export default AdminPage;
