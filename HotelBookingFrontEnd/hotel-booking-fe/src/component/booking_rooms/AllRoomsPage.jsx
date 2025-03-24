import { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import Pagination from "../common/Pagination";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";
import { Container, Row, Col, Form} from "react-bootstrap";

const AllRoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [roomTypes, setRoomType] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage] = useState(5);

    const handleSearchResult = (results) => {
        setRooms(results);
        setFilteredRooms(results);
    };

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const resp = await ApiService.getAllRooms();
                console.log("Rooms fetched:", resp.rooms); // Debugging log
                setRooms(resp.rooms);
                setFilteredRooms(resp.rooms);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchRoomsType = async () => {
            try {
                const types = await ApiService.getRoomTypes();
                setRoomType(types);
            } catch (error) {
                console.log(error);
            }
        };

        fetchRooms();
        fetchRoomsType();
    }, []);

    const handleRoomTypeChange = (e) => {
        const selectedType = e.target.value;
        setSelectedRoomType(selectedType);
        filterRooms(selectedType);
    };

    const filterRooms = (type) => {
        if (type === "") {
            setFilteredRooms(rooms);
        } else {
            const filtered = rooms.filter((room) => room.type === type);
            setFilteredRooms(filtered);
        }
        setCurrentPage(1);
    };

    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRoom = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container className="all-rooms mt-4 text-white">
            <h2 className="text-center mb-4">All Rooms</h2>

            <Row className="justify-content-center mb-4">
                <Col md={6}>
                    <Form.Group controlId="roomTypeFilter">
                        <Form.Label>Filter by room type</Form.Label>
                        <Form.Select
                            value={selectedRoomType}
                            onChange={handleRoomTypeChange}
                            className="room-type-select"
                        >
                            <option value="">All</option>
                            {roomTypes.map((type) => (
                                <option value={type} key={type}>
                                    {type}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <RoomSearch handleSearchResult={handleSearchResult} />

            <Row className="mt-4">
                <Col>
                    <RoomResult roomSearchResult={currentRoom.length > 0 ? currentRoom : []} />
                </Col>
            </Row>

            <Row className="justify-content-center mt-4">
                <Col md={6} className="d-flex justify-content-center">
                    <Pagination
                        roomPerPage={roomsPerPage}
                        totalRooms={filteredRooms.length}
                        currentPage={currentPage}
                        paginate={paginate}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default AllRoomsPage;