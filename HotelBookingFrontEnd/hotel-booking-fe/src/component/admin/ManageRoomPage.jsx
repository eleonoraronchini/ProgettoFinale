import { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import Pagination from "../common/Pagination";
import RoomResult from "../common/RoomResult";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

const ManageRoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const resp = await ApiService.getAllRooms();
        setRooms(resp.rooms);
        setFilteredRooms(resp.rooms);
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchRoomTypes = async () => {
      try {
        const resp = await ApiService.getRoomTypes();
        setRoomTypes(resp);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchRooms();
    fetchRoomTypes();
  }, []);

  const handleRoomTypeChange = (e) => {
    filterRoomFunction(e.target.value);
  };

  const filterRoomFunction = (type) => {
    if (type === "" || type === null) {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter((room) => room.type === type);
      setFilteredRooms(filtered);
    }
    setCurrentPage(1);
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">All Rooms</h2>

      <Row className="mb-4 justify-content-center">
        <Col md={6} lg={4}>
          <Form.Group controlId="roomTypeFilter">
            <Form.Label>Filter by room type</Form.Label>
            <Form.Select onChange={handleRoomTypeChange} className="mb-3 form-color">
              <option value="">All</option>
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button
           
            onClick={() => navigate("/admin/add-room")}
            className="w-100 button-class"
          >
            Add Room
          </Button>
        </Col>
      </Row>

      <RoomResult roomSearchResult={currentRooms} />

      <Row className="justify-content-center mt-4">
        <Col md={6} className="d-flex justify-content-center">
          <Pagination
            roomsPerPage={roomsPerPage}
            totalRooms={filteredRooms.length}
            currentPage={currentPage}
            paginate={paginate}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ManageRoomPage;
