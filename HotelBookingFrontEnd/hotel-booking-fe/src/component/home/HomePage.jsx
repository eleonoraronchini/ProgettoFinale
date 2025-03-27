import React, { useState, useEffect } from "react";
import { Container, Row, Col, Image, Card, Carousel } from "react-bootstrap";
import RoomSearch from "../common/RoomSearch";
import RoomResult from "../common/RoomResult";

const HomePage = () => {
  const [roomSearchResult, setRoomSearchResult] = useState([]);
  const [isResortVisible, setIsResortVisible] = useState(false);
  const [isServicesVisible, setIsServicesVisible] = useState(false);

  const handleSearchResult = (results) => {
    setRoomSearchResult(results);
  };

  // Funzione per verificare la visibilità di un elemento
  const checkVisibility = () => {
    const resortElement = document.getElementById("resort-section");
    const servicesElement = document.getElementById("services-section");

    const resortInView = resortElement.getBoundingClientRect().top < window.innerHeight;
    const servicesInView = servicesElement.getBoundingClientRect().top < window.innerHeight;

    setIsResortVisible(resortInView);
    setIsServicesVisible(servicesInView);
  };

 
  useEffect(() => {
    window.addEventListener("scroll", checkVisibility);

   
    return () => {
      window.removeEventListener("scroll", checkVisibility);
    };
  }, []);

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
                        src="./images/home1.jpg"
                        alt="Hotel Room"
                        fluid
                        className="centered-image"
                      />
                    </Carousel.Item>
                    <Carousel.Item>
                      <Image
                        src="./images/home2.jpg"
                        alt="Hotel Room"
                        fluid
                        className="centered-image"
                      />
                    </Carousel.Item>
                    <Carousel.Item>
                      <Image
                        src="./images/home3.jpg"
                        alt="Hotel Room"
                        fluid
                        className="centered-image"
                      />
                    </Carousel.Item>
                  </Carousel>

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

      {/* IL RESORT - New Section */}
      <section
        id="resort-section"
        className={`resort-section text-center py-5 ${isResortVisible ? 'fade-in' : ''}`}
      >
        <Container>
          <Row>
            <Col>
            <h2>THE RESORT</h2>
<p>A place to unwind</p>
<p>
  Surrounded by nature, pampered from morning to night
</p>
<p>
  Arriving and immediately slowing down: at the PunPun Lodge Resort, 
  in the heart of Val Gardena, it's possible. This is made possible not only by our attentive staff, 
  but also by a beautiful environment and the wellness world that invites you to unplug. 
  Both outdoors and indoors, tradition meets modernity, forming a perfect symbiosis. 
  Outside, the Dolomites take center stage, offering a breathtaking panorama 
  and countless activities to explore.
</p>

            </Col>
          </Row>
        </Container>
      </section>

      {/* Room Search Section */}
      <section className="room-selection-section py-5">
        <Container>
          <Row>
            <Col>
              <RoomSearch handleSearchResult={handleSearchResult} />
            </Col>
          </Row>
          <Row>
            <Col>
              <RoomResult roomSearchResult={roomSearchResult} />
            </Col>
          </Row>
        </Container>
      </section>

      {/* View All Rooms Link */}
      <section className="view-rooms-section p-4 text-center">
        <h4>
          <a className="view-room-home text-decoration-underline" href="/rooms">
            ALL ROOMS
          </a>
        </h4>
      </section>

      {/* Services Section */}
      <section
        id="services-section"
        className={`p-5 services-section ${isServicesVisible ? 'fade-in' : ''}`}
      >
        <h2 className="home-services text-center pb-3">
          Services at <span className="different-color">PunPun Lodge</span>
        </h2>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6} className="mb-4">
            <Card className="service-card mx-4">
              <Card.Body className="service-card-body">
                <Card.Img
                  variant="top"
                  src="./images/airconditioning.png"
                  alt="Air conditioning"
                  className="service-card-img"
                />
                <div>
                  <Card.Title>Air conditioning</Card.Title>
                  <Card.Text>
                    Stay cool and comfortable throughout your stay.
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} sm={12} md={6} lg={6} className="mb-4">
            <Card className="service-card mx-4">
              <Card.Body className="service-card-body">
                <Card.Img
                  variant="top"
                  src="./images/minibaar.png"
                  alt="Mini bar"
                  className="service-card-img"
                />
                <div>
                  <Card.Title>Mini bar</Card.Title>
                  <Card.Text>
                    Enjoy a convenient selection of beverages.
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} sm={12} md={6} lg={6} className="mb-4">
            <Card className="service-card mx-4">
              <Card.Body className="service-card-body bg-white">
                <Card.Img
                  variant="top"
                  src="./images/parking.png"
                  alt="Parking"
                  className="service-card-img"
                />
                <div>
                  <Card.Title>Parking</Card.Title>
                  <Card.Text>
                    We have a cool parking space for your vehicle.
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} sm={12} md={6} lg={6} className="mb-4">
            <Card className="service-card mx-4">
              <Card.Body className="service-card-body">
                <Card.Img
                  variant="top"
                  src="./images/wi.fi.png"
                  alt="Wi-fi"
                  className="service-card-img"
                />
                <div>
                  <Card.Title>Wi-fi</Card.Title>
                  <Card.Text>
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
