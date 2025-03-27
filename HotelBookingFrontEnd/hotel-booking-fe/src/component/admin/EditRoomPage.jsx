import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { Container, Row, Col, Form, Button, Modal, Alert } from "react-bootstrap";

const EditRoomPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [roomDetails, setRoomDetails] = useState({
        roomNumber: "",
        type: "",
        pricePerNight: "",
        capacity: "",
        description: "",
        imageUrl: "",
    });

    const [roomTypes, setRoomTypes] = useState([]);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const roomResponse = await ApiService.getRoomById(roomId);
                setRoomDetails({
                    roomNumber: roomResponse.room.roomNumber,
                    type: roomResponse.room.type,
                    pricePerNight: roomResponse.room.pricePerNight,
                    capacity: roomResponse.room.capacity,
                    description: roomResponse.room.description,
                    imageUrl: roomResponse.room.imageUrl,
                });

                const typeResponse = await ApiService.getRoomTypes();
                setRoomTypes(typeResponse);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        };

        fetchData();
    }, [roomId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomDetails((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setPreview(null);
        }
    };

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append("type", roomDetails.type);
            formData.append("pricePerNight", roomDetails.pricePerNight);
            formData.append("description", roomDetails.description);
            formData.append("capacity", roomDetails.capacity);
            formData.append("id", roomId);

            if (file) {
                formData.append("imageFile", file);
            }

            const result = await ApiService.updateRoom(formData);
            if (result.status === 200) {
                setSuccess("Room updated successfully.");
                setShowSuccessModal(true);

                setTimeout(() => {
                    setShowSuccessModal(false);
                    navigate("/admin/manage-rooms");
                }, 2000);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(""), 5000);
        }
    };

    const handleDelete = () => {
        setShowConfirmDelete(true);
    };

    const confirmDelete = async () => {
        try {
            const result = await ApiService.deleteRoom(roomId);
            if (result.status === 200) {
                setSuccess("Room deleted successfully.");
                setShowSuccessModal(true);
                setTimeout(() => {
                    setShowSuccessModal(false);
                    navigate("/admin/manage-rooms");
                }, 2000);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        } finally {
            setTimeout(() => setError(""), 5000);
            setShowConfirmDelete(false);
        }
    };

    return (
        <Container>
            <Row className="justify-content-center text-dark mb-4">
                <Col md={12}>
                    <div className="add-room-form p-4" style={{ backgroundColor: "#222", color:"white" }}>
                        <h2 className="text-center">Edit Room</h2>

                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}

                        <Form>
                            <div className="text-center mb-3">
                                {(preview || roomDetails.imageUrl) && (
                                    <div style={{
                                        maxHeight: "400px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        overflow: "hidden",
                                        borderRadius: "8px",
                                        
                                    }}>
                                        <img
                                            src={preview || roomDetails.imageUrl}
                                            alt={preview ? "room-preview" : "room"}
                                            style={{
                                                maxWidth: "100%",
                                                maxHeight: "100%",
                                                objectFit: "contain"
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <Form.Group>
                                <Form.Label>Upload Image</Form.Label>
                                <Form.Control type="file" onChange={handleFileChange} className="form-color"/>
                            </Form.Group>

                            <Form.Group className="mt-3">
                                <Form.Label>Room Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="type"
                                    value={roomDetails.type}
                                    onChange={handleChange}
                                    className="form-color"
                                >
                                    <option value="">Select a type</option>
                                    {roomTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group className="mt-3">
                                <Form.Label>Room Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="pricePerNight"
                                    value={roomDetails.pricePerNight}
                                    onChange={handleChange}
                                    className="form-color"
                                />
                            </Form.Group>

                            <Form.Group className="mt-3">
                                <Form.Label>Room Number</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="roomNumber"
                                    value={roomDetails.roomNumber}
                                    onChange={handleChange}
                                    className="form-color"
                                />
                            </Form.Group>

                            <Form.Group className="mt-3">
                                <Form.Label>Room Capacity</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="capacity"
                                    value={roomDetails.capacity}
                                    onChange={handleChange}
                                    className="form-color"
                                />
                            </Form.Group>

                            <Form.Group className="mt-3">
                                <Form.Label>Room Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    value={roomDetails.description}
                                    onChange={handleChange}
                                    className="form-color"
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-between mt-4">
                                <Button className="button-class" onClick={handleUpdate}>
                                    Update Room
                                </Button>
                                <Button variant="dark" style={{borderRadius: 0, border: "1px solid white"}} onClick={handleDelete}>
                                    Delete Room
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>

            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Body className="text-center text-dark">
                    <h5>{success}</h5>
                </Modal.Body>
            </Modal>

            <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)} centered>
                <Modal.Body className="text-center text-dark">
                    <h5>Are you sure you want to delete this room?</h5>
                    <Button variant="black" className="border-black" onClick={confirmDelete}>
                        Yes, Delete
                    </Button>{" "}
                    <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
                        Cancel
                    </Button>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default EditRoomPage;
