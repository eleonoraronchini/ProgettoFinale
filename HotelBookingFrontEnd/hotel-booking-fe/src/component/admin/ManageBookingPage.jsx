import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import Pagination from "../common/Pagination";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const ManageBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await ApiService.getAllBookings();
        setBookings(response.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings", error.message);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    if (!searchTerm) return bookings;
    return bookings.filter((booking) =>
      booking.bookingReference?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, bookings]);

  const currentBookings = useMemo(() => {
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    return filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  }, [currentPage, filteredBookings, bookingsPerPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">All Bookings</h2>

      <Row className="mb-4 justify-content-center">
        <Col md={6}>
          <Form.Group controlId="searchBooking">
            <Form.Label>Filter by booking number</Form.Label>
            <Form.Control
            className="form-color"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Enter booking number"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        {currentBookings.map((booking) => (
          <Col key={booking.id} md={4} className="mb-4">
            <div className="booking-result-item border p-3 rounded">
              <p>
                <strong>Booking code:</strong> {booking.bookingReference}
              </p>
              <p>
                <strong>Check in date:</strong> {booking.checkInDate}
              </p>
              <p>
                <strong>Check out date:</strong> {booking.checkOutDate}
              </p>
              <p>
                <strong>Total price:</strong> {booking.totalPrice}
              </p>
              <p>
                <strong>Payment status:</strong> {booking.paymentStatus}
              </p>
              <p>
                <strong>Booking status:</strong> {booking.bookingStatus}
              </p>
              <Button
                className="button-class"
                onClick={() =>
                  navigate(`/admin/edit-booking/${booking.bookingReference}`)
                }
              >
                Manage booking
              </Button>
            </div>
          </Col>
        ))}
      </Row>

      <Row className="justify-content-center mt-4">
        <Col md={6} className="d-flex justify-content-center">
          <Pagination
            roomsPerPage={bookingsPerPage}
            totalRooms={filteredBookings.length}
            currentPage={currentPage}
            paginate={setCurrentPage}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ManageBookingPage;
