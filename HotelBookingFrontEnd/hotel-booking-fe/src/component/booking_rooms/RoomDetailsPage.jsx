import React, { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';

const RoomDetailsPage = () => {
    const navigate = useNavigate();
    const { roomId } = useParams();

    const [room, setRoom] = useState(null);
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [totalPrice, setTotalPrice] = useState(null);
    const [totalDaysToStay, setTotalDaysToStay] = useState(null);
    const [showBookingPreview, setShowBookingPreview] = useState(false);
    const [showMessage, setShowMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const resp = await ApiService.getRoomById(roomId);
                setRoom(resp.room);
            } catch (error) {
                console.log(error);
            }
        };
        fetchRoomDetails();
    }, [roomId]);

    const calculateTotalPrice = () => {
        if (!checkInDate || !checkOutDate) return 0;

        const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
        const totalDays = Math.round(
            Math.abs((new Date(checkOutDate) - new Date(checkInDate)) / oneDay)
        );

        setTotalDaysToStay(totalDays);
        return room?.pricePerNight * totalDays || 0;
    };

    const handleConfirmation = () => {
        if (!checkInDate || !checkOutDate) {
            setErrorMessage("Please select both check-in and check-out dates");
            setTimeout(() => setErrorMessage(null), 5000);
            return;
        }

        
        const today = new Date();
        if (checkInDate < today) {
            setErrorMessage("Check-in date cannot be before today");
            setTimeout(() => setErrorMessage(null), 5000);
            return;
        }
        if (checkOutDate < checkInDate) {
            setErrorMessage("Check-out date cannot be before check-in date");
            setTimeout(() => setErrorMessage(null), 5000);
            return;
        }

        setTotalPrice(calculateTotalPrice());
        setShowBookingPreview(true);
    };

    const acceptBooking = async () => {
        try {
            const formattedCheckInDate = checkInDate.toLocaleDateString("en-CA");
            const formattedCheckOutDate = checkOutDate.toLocaleDateString("en-CA");

            const booking = {
                checkInDate: formattedCheckInDate,
                checkOutDate: formattedCheckOutDate,
                roomId: room.id
            };

            const resp = await ApiService.bookRoom(booking);
            if (resp.status === 200) {
                setShowMessage("Your booking is successful. Your booking details have been sent to your email. Please proceed for payment.");
                setTimeout(() => {
                    setShowMessage(null);
                    navigate("/home");  
                }, 5000); 
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || error.message);
        }
    };

    if (!room) {
        return <div>Loading...</div>;
    }

    const { roomNumber, type, pricePerNight, capacity, description, imageUrl } = room;

    return (
        <Container className="my-5">
            <Row>
                <Col md={8}>
                    <Card>
                        <Card.Img variant="top" src={imageUrl} alt={type} />
                        <Card.Body>
                            <Card.Title>{type}</Card.Title>
                            <Card.Text>
                                <strong>Room Number:</strong> {roomNumber} <br />
                                <strong>Capacity:</strong> {capacity} <br />
                                <strong>Price:</strong> ${pricePerNight}/night <br />
                                <strong>Description:</strong> {description}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className=" background-color p-4">
                        <h4>Select Check-in and Check-out Dates</h4>
                        <DayPicker 
                            selected={checkInDate}
                            onDayClick={setCheckInDate}
                            mode="single" 
                            modifiers={{
                                selected: checkInDate ? [checkInDate] : [],  
                                checkOut: checkOutDate ? [checkOutDate] : [], 
                            }}
                            modifiersClassNames={{
                                selected: 'highlight-selected',
                                checkOut: 'highlight-checkout'
                            }}
                        />
                        <DayPicker 
                            selected={checkOutDate} 
                            onDayClick={setCheckOutDate}
                            mode="single" 
                            modifiers={{
                                selected: checkOutDate ? [checkOutDate] : [], 
                                checkIn: checkInDate ? [checkInDate] : [], 
                            }}
                            modifiersClassNames={{
                                selected: 'highlight-selected',
                                checkIn: 'highlight-checkin'
                            }}
                        />
                    </Card>
                    {showMessage && <Alert variant="success" className="mt-4">{showMessage}</Alert>}
                    {errorMessage && <Alert variant="danger" className="mt-4">{errorMessage}</Alert>}

                    <Card className="mt-4">
                        {totalDaysToStay > 0 && (
                            <>
                                <Card.Body>
                                    <h5>Booking Summary</h5>
                                    <p className="m-0"><strong>Total Days:</strong> {totalDaysToStay}</p>
                                    <p className="m-0"><strong>Total Price:</strong> ${totalPrice}</p>
                                </Card.Body>
                            </>
                        )}

                        {showBookingPreview && (
                            <Card.Body>
                                <Button className="button-class" onClick={acceptBooking}>
                                    Confirm Booking
                                </Button>
                            </Card.Body>
                        )}
                    </Card>

                    <Button onClick={handleConfirmation} className="mt-3 bg-dark border-dark">
                        Preview Booking
                    </Button>
                    
                </Col>
            </Row>
        </Container>
    );
};

export default RoomDetailsPage;
