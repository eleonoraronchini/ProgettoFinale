import React from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import { Button, Card, Col, Row, Container } from "react-bootstrap";

const RoomResult = ({ roomSearchResult }) => {
  const navigate = useNavigate();
  const isAdmin = ApiService.isAdmin();

  return (
    
    
    <Container className="mt-4">
      <Row>
        {roomSearchResult.map((room) => (
          <Col key={room.id} md={6} className="mb-4">
            <Card>
              <Card.Img variant="top" src={room.imageUrl} alt={room.roomNumber} />
              <Card.Body className="card-body">
                <Card.Title>{room.type}</Card.Title>
                <Card.Text>
                  <strong>Price: </strong>${room.pricePerNight} per night
                </Card.Text>
                <Card.Text>
                  <strong>Description: </strong>
                  {room.description}
                </Card.Text>

                <div className="d-flex justify-content-between">
                  {isAdmin ? (
                    <Button
                    className="button-room"
                      onClick={() => navigate(`/admin/edit-room/${room.id}`)}
                    >
                      Edit Room
                    </Button>
                  ) : (
                    <Button
                    className="button-room"
                      onClick={() => navigate(`/room-details/${room.id}`)}
                    >
                      View/Book Room
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RoomResult;
