import React, { useState } from "react";
import { Container, Row, Col, Image, Card } from "react-bootstrap";
import RoomSearch from "../common/RoomSearch";
import RoomResult from "../common/RoomResult";

const HomePage = () => {
  const [roomSearchResult, setRoomSearchResult] = useState([]);

  const handleSearchResult = (results) => {
    setRoomSearchResult(results);
  };

  return (
    <div className="home m-0">
      <section className="header-section">
        <header>
          <Container fluid>
            <Row>
              <Col className="p-0">
                <div className="header-banner">
                  <Image
                    src="./images/home.jpg"
                    alt="Hotel"
                    fluid
                    className="centered-image"
                  />
                  <div className="overlay"></div>
                  <div className="animated-text">
                    <h1>
                      Welcome to{" "}
                      <span className="different-color">PunPun Lodge</span>
                    </h1>
                    <br />
                    <h3>Step into a heaven of comfort and care</h3>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </header>
      </section>

      <section className="room-selection-section py-5">
        <Container>
          <Row>
            <Col>
              <RoomSearch handSearchResult={handleSearchResult} />
            </Col>
          </Row>
          <Row>
            <Col>
              <RoomResult handSearchResults={roomSearchResult} />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="view-rooms-section p-4 me-2 text-center">
        <h4>
          <a className="view-room-home text-warning text-decoration-underline" href="/rooms">
            All rooms
          </a>
        </h4>
      </section>
      <section>
      <h2 className="home-services text-center pb-3">
        Services at <span className="different-color">PunPun Lodge</span>
      </h2>
      <Row>
      
        <Col xs={12} sm={6} md={6} lg={6} className="mb-4">
          <Card className="service-card">
            <Card.Body className="service-card-body">
              <Card.Img
                variant="top"
                src="./images/airconditioning.png"
                alt="Air conditioning"
                className="service-card-img"
              />
              <div>
                <Card.Title className="service-card-title">Air conditioning</Card.Title>
                <Card.Text className="service-card-text">
                  Stay cool and comfortable throughout your stay with your individually controlled in-room air conditioning.
                </Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>

      
        <Col xs={12} sm={6} md={6} lg={6} className="mb-4">
          <Card className="service-card">
            <Card.Body className="service-card-body">
              <Card.Img
                variant="top"
                src="./images/camera1.jpg"
                alt="Mini bar"
                className="service-card-img"
              />
              <div>
                <Card.Title className="service-card-title">Mini bar</Card.Title>
                <Card.Text className="service-card-text">
                  Enjoy a convenient selection of beverages.
                </Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>

        
        <Col xs={12} sm={6} md={6} lg={6} className="mb-4">
          <Card className="service-card">
            <Card.Body className="service-card-body">
              <Card.Img
                variant="top"
                src="./images/camera1.jpg"
                alt="Parking"
                className="service-card-img"
              />
              <div>
                <Card.Title className="service-card-title">Parking</Card.Title>
                <Card.Text className="service-card-text">
                  We have a cool parking space for your vehicle, free of charge.
                </Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={6} lg={6} className="mb-4">
          <Card className="service-card">
            <Card.Body className="service-card-body">
              <Card.Img
                variant="top"
                src="./images/camera1.jpg"
                alt="Wi-fi"
                className="service-card-img"
              />
              <div>
                <Card.Title className="service-card-title">Wi-fi</Card.Title>
                <Card.Text className="service-card-text">
                  Stay connected to our free Wi-Fi.
                </Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
    </div>
  );
};

export default HomePage;
