import { useState, useEffect } from "react";
import ApiService from "../../service/ApiService";
import Pagination from "../common/Pagination";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";
import { Container, Row, Col, Form, Carousel, Image } from "react-bootstrap";

const AllRoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]); 
    const [roomTypes, setRoomTypes] = useState([]); 
    const [selectedRoomType, setSelectedRoomType] = useState(""); 

    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage] = useState(4);

    const handleSearchResult = (results) => {
        setRooms(results);
        setFilteredRooms(results);
    };

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const resp = await ApiService.getAllRooms();
                console.log("Rooms fetched:", resp.rooms);
                setRooms(resp.rooms);
                setFilteredRooms(resp.rooms); 
            } catch (error) {
                console.log(error);
            }
        };

        const fetchRoomsType = async () => {
            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types); 
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
        <div className="home m-0">
            {/* Carosello di Immagini */}
            <section className="header-section">
                <header>
                    <Container fluid>
                        <Row>
                            <Col className="p-0">
                                <div className="header-banner">
                                    <Carousel>
                                        <Carousel.Item>
                                            <Image
                                                src="/images/roomhome3.jpg"
                                                alt="Hotel Room"
                                                fluid
                                                className="centered-image"
                                            />
                                        </Carousel.Item>
                                        <Carousel.Item>
                                            <Image
                                                src="/images/roomhome2.jpg"
                                                alt="Hotel Room"
                                                fluid
                                                className="centered-image"
                                            />
                                        </Carousel.Item>
                                        <Carousel.Item>
                                            <Image
                                                src="/images/roomhome1.jpg"
                                                alt="Hotel Room"
                                                fluid
                                                className="centered-image"
                                            />
                                        </Carousel.Item>
                                    </Carousel>

                                    <div className="overlay"></div>
                                    <div className="animated-text">
                                        <h1>
                                            Discover your perfect retreat at {" "}
                                            <span className="different-color">PunPun Lodge</span>
                                        </h1>
                                        <br />
                                        <h3>Where every room promises rest, relaxation, and luxury</h3>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </header>
            </section>

            <section>
                <h2 className="text-center my-4">Rooms and Suites</h2>

                <Row className="justify-content-center mb-4">
                    <Col md={6}>
                        <Form.Group controlId="roomTypeFilter">
                            <Form.Label>Filter by room type</Form.Label>
                            <Form.Select
                                value={selectedRoomType} 
                                onChange={handleRoomTypeChange} 
                                className="room-type-select, form-color"
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
                            roomsPerPage={roomsPerPage}
                            totalRooms={filteredRooms.length}
                            currentPage={currentPage}
                            paginate={paginate}
                        />
                    </Col>
                </Row>
            </section>
        </div>
    );
};

export default AllRoomsPage;
