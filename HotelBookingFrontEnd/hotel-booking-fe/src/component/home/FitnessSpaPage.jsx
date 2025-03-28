import React, { useState, useEffect } from "react";
import { Container, Row, Col, Image, Card, Carousel } from "react-bootstrap";

const FitnessSpaPage = () => {
  const [isResortVisible, setIsResortVisible] = useState(false);
  const [isServicesVisible, setIsServicesVisible] = useState(false);

  const checkVisibility = () => {
    const resortElement = document.getElementById("resort-section");
    const servicesElement = document.getElementById("services-section");

    const resortInView = resortElement?.getBoundingClientRect().top < window.innerHeight;
    const servicesInView = servicesElement?.getBoundingClientRect().top < window.innerHeight;

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
    <div className="fitness-spa m-0">
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
                        src="/images/piscina.jpg"
                        alt="Swimming Pool"
                        fluid
                        className="centered-image"
                      />
                    </Carousel.Item>
                    <Carousel.Item>
                      <Image
                        src="/images/fitness.jpg"
                        alt="Fitness Center"
                        fluid
                        className="centered-image"
                      />
                    </Carousel.Item>
                  </Carousel>

                  <div className="overlay"></div>
                  <div className="animated-text">
                    <h1>Find Your Balance at PunPun Lodge</h1>
                    <br /> 
                    <h3>Fitness & Spa - Your wellness destination</h3>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </header>
      </section>

      {/* FITNESS & SPA Section */}
      <section
        id="resort-section"
        className={`resort-section text-center py-5 ${isResortVisible ? 'fade-in' : ''}`}
      >
        <Container>
          <Row>
            <Col>
              <h2>FITNESS CENTER WORKING HOURS</h2>
              <p>DAILY, 7:00 - 23:00</p>
              <p>FITNESS CENTER</p>
              <p>
                Fitness center and SPA is available to all hotel guests with unlimited access. 
                Cardio machines, free weights, treadmill, exercise bicycle, weight machines are at your disposal.
              </p>
              
              <h2 className="mt-5">SWIMMING POOL WORKING HOURS</h2>
              <p>DAILY, 7:00 - 23:00</p>
              <p>SWIMMING POOL</p>
              <p>Heated pool, Jacuzzi with whirlpool, dry and steam sauna.</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section - Versione corretta */}
      <section
        id="services-section"
        className={`p-5 services-section ${isServicesVisible ? 'fade-in' : ''}`}
      >
        <h2 className="home-services text-center pb-3">
          Wellness Services at <span className="text-primary">PunPun Lodge</span>
        </h2>
        <Row>
          {/* Massaggi */}
          <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="service-card h-100">
              <Card.Body className="service-card-body">
                <Card.Img
                  variant="top"
                  src="/images/massage.png"
                  alt="Massage"
                  className="service-card-img"
                />
                <div>
                  <Card.Title>Massage Therapies</Card.Title>
                  <Card.Text>
                    Swedish, deep tissue, hot stone and aromatherapy massages.
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Sauna */}
          <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="service-card h-100">
              <Card.Body className="service-card-body">
                <Card.Img
                  variant="top"
                  src="/images/sauna.png"
                  alt="Sauna"
                  className="service-card-img"
                />
                <div>
                  <Card.Title>Sauna & Steam Room</Card.Title>
                  <Card.Text>
                    Finnish sauna and Turkish bath with essential oil infusions.
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Piscina */}
          <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="service-card h-100">
              <Card.Body className="service-card-body">
                <Card.Img
                  variant="top"
                  src="/images/pool.png"
                  alt="Pool"
                  className="service-card-img"
                />
                <div>
                  <Card.Title>Heated Pool</Card.Title>
                  <Card.Text>
                    25m indoor pool with hydro-massage jets and relaxation area.
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Attrezzatura fitness */}
          <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="service-card h-100">
              <Card.Body className="service-card-body">
                <Card.Img
                  variant="top"
                  src="/images/fitness-equipment.png"
                  alt="Fitness"
                  className="service-card-img"
                />
                <div>
                  <Card.Title>Fitness Equipment</Card.Title>
                  <Card.Text>
                    Latest generation Technogym machines and free weights area.
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Trattamenti viso */}
          <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="service-card h-100">
              <Card.Body className="service-card-body">
                <Card.Img
                  variant="top"
                  src="/images/facial.jpg"
                  alt="Facial"
                  className="service-card-img"
                />
                <div>
                  <Card.Title>Facial Treatments</Card.Title>
                  <Card.Text>
                    Anti-aging, hydrating and detox facial treatments.
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Yoga */}
          <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="service-card h-100">
              <Card.Body className="service-card-body">
                <Card.Img
                  variant="top"
                  src="/images/yoga.png"
                  alt="Yoga"
                  className="service-card-img"
                />
                <div>
                  <Card.Title>Yoga Classes</Card.Title>
                  <Card.Text>
                    Daily Hatha, Vinyasa and Yin yoga sessions with instructors.
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Jacuzzi */}
          <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="service-card h-100">
              <Card.Body className="service-card-body">
                <Card.Img
                  variant="top"
                  src="/images/jacuzzi.png"
                  alt="Jacuzzi"
                  className="service-card-img"
                />
                <div>
                  <Card.Title>Hydrotherapy Jacuzzi</Card.Title>
                  <Card.Text>
                    Therapeutic whirlpool with chromotherapy and neck massagers.
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Trattamenti corpo */}
          <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="service-card h-100">
              <Card.Body className="service-card-body">
                <Card.Img
                  variant="top"
                  src="/images/body-treatment.png"
                  alt="Body Treatment"
                  className="service-card-img"
                />
                <div>
                  <Card.Title>Body Treatments</Card.Title>
                  <Card.Text>
                    Body wraps, scrubs and detox treatments with organic products.
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Sezione orari */}
        <div className="text-center mt-5 opening-hours">
          <h3>SPA OPENING HOURS</h3>
          <p>Monday to Friday: 9:00 - 20:00</p>
          <p>Weekends: 8:00 - 21:00</p>
          <p className="mt-3">* Advance booking required for treatments</p>
          <p>+39 0471 123 457</p>
        </div>
      </section>
    </div>
  );
};

export default FitnessSpaPage;