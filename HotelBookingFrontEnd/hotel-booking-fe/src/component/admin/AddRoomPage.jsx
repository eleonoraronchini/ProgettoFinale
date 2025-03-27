import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { Container, Row, Col, Form, Button, Alert, Modal } from "react-bootstrap";

const AddRoomPage = () => {
  const navigate = useNavigate();

  const [roomDetails, setRoomDetails] = useState({
    imageUrl: null,
    type: "",
    roomNumber: "",
    pricePerNight: "",
    capacity: "",
    description: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); 
  const [showSuccessModal, setShowSuccessModal] = useState(false); 

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    };

    fetchRoomTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRoomTypeChange = (e) => {
    setRoomDetails((prevState) => ({
      ...prevState,
      type: e.target.value,
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

  const addRoom = async () => {
    if (
      !roomDetails.type ||
      !roomDetails.pricePerNight ||
      !roomDetails.capacity ||
      !roomDetails.roomNumber
    ) {
      setError("All room details must be provided.");
      setTimeout(() => setError(""), 5000);
      return;
    }

    setShowConfirmModal(true); 
  };

  const handleConfirmAddRoom = async () => {
    setShowConfirmModal(false); 
    setLoading(true); 

    try {
      const formData = new FormData();
      formData.append("type", roomDetails.type);
      formData.append("pricePerNight", roomDetails.pricePerNight);
      formData.append("capacity", roomDetails.capacity);
      formData.append("roomNumber", roomDetails.roomNumber);
      formData.append("description", roomDetails.description);

      if (file) {
        formData.append("imageFile", file);
      }

      const result = await ApiService.addRoom(formData);
      if (result.status === 200) {
        setSuccess("Room added successfully!");
        setShowSuccessModal(true); 

        setTimeout(() => {
          setShowSuccessModal(false);
          navigate("/rooms"); 
        }, 2000); 
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false); 
    }
  };

  return (
  <div style={{
    backgroundColor: "#222",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
  }}>
    <Container className="mt-5">
      <Row className="justify-content-center text-dark mb-4 " >
        <Col md={6}>
          <div className="add-room-form p-4 shadow-lg rounded" style={{ backgroundColor: "#f8f9fa" }}>
            <h2 className="text-center mb-4">Add New Room</h2>

          
            {error && <Alert variant="danger">{error}</Alert>}

            <Form>
              <Form.Group controlId="roomPhoto" className="mb-3">
                {preview && (
                  <img
                    src={preview}
                    alt="room-preview"
                    className="img-fluid mb-3"
                    style={{ maxWidth: "100%", borderRadius: "8px" }}
                  />
                )}
                <Form.Label>Upload Room Photo</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} className="no-shadow" />
              </Form.Group>

             
              <Form.Group controlId="roomType" className="mb-3" >
                <Form.Label>Room Type</Form.Label>
                <Form.Select value={roomDetails.type} onChange={handleRoomTypeChange}  className="no-shadow">
                  <option value="">Select a room type</option>
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="pricePerNight" className="mb-3">
                <Form.Label>Room Price per Night</Form.Label>
                <Form.Control
                  type="number"
                  name="pricePerNight"
                  value={roomDetails.pricePerNight}
                  onChange={handleChange}
                  placeholder="Enter price"
                   className="no-shadow"
                />
              </Form.Group>

             
              <Form.Group controlId="roomNumber" className="mb-3">
                <Form.Label>Room Number</Form.Label>
                <Form.Control
                  type="number"
                  name="roomNumber"
                  value={roomDetails.roomNumber}
                  onChange={handleChange}
                  placeholder="Enter room number"
                   className="no-shadow"
                />
              </Form.Group>

            
              <Form.Group controlId="capacity" className="mb-3">
                <Form.Label>Capacity</Form.Label>
                <Form.Control
                  type="number"
                  name="capacity"
                  value={roomDetails.capacity}
                  onChange={handleChange}
                  placeholder="Enter capacity"
                   className="no-shadow"
                />
              </Form.Group>

       
              <Form.Group controlId="description" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  type="text"
                  name="description"
                  value={roomDetails.description}
                  onChange={handleChange}
                  placeholder="Enter room description"
                   className="no-shadow"
                />
              </Form.Group>

            
              <Button
                onClick={addRoom}
                className="w-100 button-class"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Room"}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>

    
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Body className="text-center text-dark ">
          <h5>{success}</h5>
        </Modal.Body>
      </Modal>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered className="modal-custom">
        <Modal.Body className="text-center textd-dark">
          <h5>Do you want to add this room?</h5>
          <Button className="button-class" onClick={handleConfirmAddRoom}>
            Yes, Add Room
          </Button>{" "}
          <Button variant="dark" style={{borderRadius: 0}} onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
   </div>
  );
};

export default AddRoomPage;
