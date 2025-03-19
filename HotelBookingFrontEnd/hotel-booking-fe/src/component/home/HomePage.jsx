import React, { useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
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
    </div>
  );
};

export default HomePage;
