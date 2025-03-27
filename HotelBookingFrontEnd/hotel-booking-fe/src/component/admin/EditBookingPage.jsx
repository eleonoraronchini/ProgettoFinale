import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { Form, Button, Modal, Container } from "react-bootstrap";

const EditBookingPage = () => {
    const { bookingCode } = useParams();
    const navigate = useNavigate();

    const [bookingDetails, setBookingDetails] = useState(null);
    const [formState, setFormState] = useState({
        id: "",
        bookingStatus: "",
        paymentStatus: "",
    });

    const [message, setMessage] = useState({ type: "", text: "" });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response = await ApiService.getBookingByReference(bookingCode);
                setBookingDetails(response.booking);
                setFormState({
                    id: response.booking.id,
                    bookingStatus: response.booking.bookingStatus,
                    paymentStatus: response.booking.paymentStatus,
                });
            } catch (error) {
                setMessage({
                    type: "error",
                    text: error.response?.data?.message || error.message,
                });
                setShowModal(true); 
            }
        };

        fetchBookingDetails();
    }, [bookingCode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        if (!formState.bookingStatus && !formState.paymentStatus) {
            setMessage({ type: "error", text: "Please update at least one field." });
            setShowModal(true);
            return;
        }

        try {
            await ApiService.updateBooking(formState);
            setMessage({ type: "success", text: "Booking updated successfully" });

            
            setShowModal(true);

            setTimeout(() => {
                setMessage({ type: "", text: "" });
                navigate("/admin/manage-bookings");
            }, 3000);
        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || error.message,
            });
            setShowModal(true); 
        }
    };

    return (
        <Container>
            <h2 className="mt-4">Update booking</h2>

            {/* Modal for success or error message */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered className="modal-custom">
                <Modal.Header closeButton>
                    <Modal.Title>{message.type === "error" ? "Error" : "Success"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{message.text}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="button-class" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {bookingDetails ? (
                <div>
                    <h3>Booking details</h3>
                    <p><strong>Confirmation code:</strong> {bookingDetails.bookingReference}</p>
                    <p><strong>Check-in date:</strong> {bookingDetails.checkInDate}</p>
                    <p><strong>Check-out date:</strong> {bookingDetails.checkOutDate}</p>
                    <p><strong>Total price:</strong> {bookingDetails.totalPrice}</p>
                    <p><strong>Payment status:</strong> {bookingDetails.paymentStatus}</p>
                    <p><strong>Booking status:</strong> {bookingDetails.bookingStatus}</p>

                    <hr />

                    <h3>Booker details</h3>
                    <p><strong>First name:</strong> {bookingDetails.user.firstName}</p>
                    <p><strong>Last name:</strong> {bookingDetails.user.lastName}</p>
                    <p><strong>Email:</strong> {bookingDetails.user.email}</p>
                    <p><strong>Phone number:</strong> {bookingDetails.user.phoneNumber}</p>

                    <hr />

                    <h3>Room details</h3>
                    <p><strong>Type:</strong> {bookingDetails.room.type}</p>
                    <p><strong>Price per night:</strong> {bookingDetails.room.pricePerNight}</p>
                    <p><strong>Capacity:</strong> {bookingDetails.room.capacity}</p>
                    <p><strong>Description:</strong> {bookingDetails.room.description}</p>
                    <img src={bookingDetails.room.imageUrl} alt="Room" height="200" />

                    <hr />

                    <h3>Update status</h3>

                    <Form>
                        <Form.Group controlId="bookingStatus">
                            <Form.Label>Booking status</Form.Label>
                            <Form.Control
                            className="form-color"
                                as="select"
                                name="bookingStatus"
                                value={formState.bookingStatus}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="BOOKED">BOOKED</option>
                                <option value="CANCELLED">CANCELLED</option>
                                <option value="CHECKED_IN">CHECKED IN</option>
                                <option value="CHECKED_OUT">CHECKED OUT</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="paymentStatus">
                            <Form.Label>Payment status</Form.Label>
                            <Form.Control
                            className="form-color"
                                as="select"
                                name="paymentStatus"
                                value={formState.paymentStatus}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="PENDING">PENDING</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="FAILED">FAILED</option>
                                <option value="REFUNDED">REFUNDED</option>
                                <option value="REVERSED">REVERSED</option>
                            </Form.Control>
                        </Form.Group>

                        <Button
                            
                            onClick={handleUpdate}
                            className="my-3 button-class"
                        >
                            Update booking
                        </Button>
                    </Form>
                </div>
            ) : (
                <p>Loading booking details...</p>
            )}
        </Container>
    );
};

export default EditBookingPage;


