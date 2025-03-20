import React, { useState, useEffect, useRef } from "react";
import ApiService from "../../service/ApiService";
import { DayPicker } from "react-day-picker";
import { Form, Button, Col, Row, Container } from "react-bootstrap";

const RoomSearch = ({ handSearchResult }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [roomType, setRoomType] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [error, setError] = useState("");

  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        console.log("Error fetching RoomTypes " + error);
      }
    };
    fetchRoomTypes();
  }, []);

  const handleClickOutside = (event) => {
    if (startDateRef.current && !startDateRef.current.contains(event.target)) {
      setStartDatePickerVisible(false);
    }
    if (endDateRef.current && !endDateRef.current.contains(event.target)) {
      setEndDatePickerVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showError = (message, timeout = 5000) => {
    setError(message);
    setTimeout(() => {
      setError("");
    }, timeout);
  };

  const handleInternalSearch = async () => {
    if (!startDate || !endDate || !roomType) {
      showError("Please select fields");
      return false;
    }
    try {
      // Formatta le date nel formato ISO (YYYY-MM-DD)
      const formattedStartDate = startDate
        ? startDate.toLocaleDateString("en-CA") // Correzione qui
        : null;
      const formattedEndDate = endDate
        ? endDate.toLocaleDateString("en-CA") // Correzione qui
        : null;

      const resp = await ApiService.getAvailableRooms(
        formattedStartDate,
        formattedEndDate,
        roomType
      );

      if (resp.status === 200) { // Correzione: status 200, non 2000
        if (resp.rooms.length === 0) {
          showError("Room type not currently available for selected date");
          return;
        }
        handSearchResult(resp.rooms);
        setError("");
      }
    } catch (error) {
      showError(error?.response?.data?.message || error.message);
    }
  };

  return (
    <Container className="mt-4">
      <div className="search-container text-black">
        <h3 className="text-center mb-4">Search for Rooms</h3>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formStartDate">
                <Form.Label>Check-in Date</Form.Label>
                <Form.Control
                  className={`date-input ${
                    isStartDatePickerVisible ? "border-secondary" : "border"
                  }`}
                  type="text"
                  value={startDate ? startDate.toLocaleDateString() : ""}
                  placeholder="Select Check-in Date"
                  onFocus={() => setStartDatePickerVisible(true)}
                  readOnly
                />
                {isStartDatePickerVisible && (
                  <div className="datepicker-container" ref={startDateRef}>
                    <DayPicker
                      selected={startDate}
                      onDayClick={(date) => {
                        setStartDate(date);
                        setStartDatePickerVisible(false);
                      }}
                      month={startDate}
                    />
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formEndDate">
                <Form.Label>Check-out Date</Form.Label>
                <Form.Control
                  className={`date-input ${
                    isEndDatePickerVisible ? "border-secondary" : "border"
                  }`}
                  type="text"
                  value={endDate ? endDate.toLocaleDateString() : ""}
                  placeholder="Select Check-out Date"
                  onFocus={() => setEndDatePickerVisible(true)}
                  readOnly
                />

                {isEndDatePickerVisible && (
                  <div className="datepicker-container" ref={endDateRef}>
                    <DayPicker
                      selected={endDate}
                      onDayClick={(date) => {
                        setEndDate(date);
                        setEndDatePickerVisible(false);
                      }}
                      month={endDate}
                    />
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3 " controlId="formRoomType">
            <Form.Label>Room Type</Form.Label>
            <Form.Control
              as="select"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="room-type-select"
            >
              <option disabled value="">
                Select Room Type
              </option>
              {roomTypes.map((roomType) => (
                <option value={roomType} key={roomType}>
                  {roomType}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <div className="d-grid justify-content-center">
            <Button className="button-class px-4 py-2 mt-3" onClick={handleInternalSearch} size="md">
              Search Rooms
            </Button>
          </div>
        </Form>

        {error && <p className="text-danger mt-3">{error}</p>}
      </div>
    </Container>
  );
};

export default RoomSearch;