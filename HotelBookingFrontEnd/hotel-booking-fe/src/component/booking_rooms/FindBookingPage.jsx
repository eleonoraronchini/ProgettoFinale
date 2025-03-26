import React, { useState } from "react";
import ApiService from "../../service/ApiService";
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';

const FindBookingPage = () => {
    const [confirmationCode, setConfirmationCode] = useState("");
    const [bookingDetails, setBookingDetails] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!confirmationCode.trim()) {
            setError("Please enter a booking confirmation code");
            setTimeout(() => setError(""), 5000);
            return;
        }
        try {
            const response = await ApiService.getBookingByReference(confirmationCode);
            setBookingDetails(response.booking);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(""), 5000);
        }
    };

    return (
        <div style={{
            backgroundImage: "url('../../../images/rest.jpg')", 
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            minHeight: "100vh",
          }}>
        <Container>
            <Row className="justify-content-center">
                <Col xs={12} md={6}>
                <div className="d-flex mt-5">
                
                    <h2 className="text-center ms-2"> Find Booking  </h2>
                    </div>
                    <div className="d-flex justify-content-between">
                        <Form.Control
                            required
                            type="text"
                            placeholder="Enter your booking confirmation code"
                            value={confirmationCode}
                            onChange={(e) => setConfirmationCode(e.target.value)}
                            className="me-2 room-type-select"
                        />
                        <Button onClick={handleSearch} variant="dark">Find</Button>
                    </div>
                    
                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                    {bookingDetails && (
                        <Card className="mt-4">
                            <Card.Body>
                                <h3>Booking Details</h3>
                                <p><strong>Booking Code:</strong> {bookingDetails.bookingReference}</p>
                                <p><strong>Check-in Date:</strong> {bookingDetails.checkInDate}</p>
                                <p><strong>Check-out Date:</strong> {bookingDetails.checkOutDate}</p>
                                <p><strong>Payment Status:</strong> {bookingDetails.paymentStatus}</p>
                                <p><strong>Total Price:</strong> {bookingDetails.totalPrice}</p>
                                <p><strong>Booking Status:</strong> {bookingDetails.bookingStatus}</p>

                                <hr />
                                <h4>Booker Details</h4>
                                <p><strong>First Name:</strong> {bookingDetails.user.firstName}</p>
                                <p><strong>Last Name:</strong> {bookingDetails.user.lastName}</p>
                                <p><strong>Email:</strong> {bookingDetails.user.email}</p>
                                <p><strong>Phone Number:</strong> {bookingDetails.user.phoneNumber}</p>

                                <hr />
                                <h4>Room Details</h4>
                                <p><strong>Room Number:</strong> {bookingDetails.room.roomNumber}</p>
                                <p><strong>Room Type:</strong> {bookingDetails.room.type}</p>
                                <p><strong>Room Capacity:</strong> {bookingDetails.room.capacity}</p>
                                <img src={bookingDetails.room.imageUrl} alt="Room" className="img-fluid" />
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
        </div>
    );
};

export default FindBookingPage;
