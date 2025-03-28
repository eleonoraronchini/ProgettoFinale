import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import ApiService from "../../service/ApiService";

const PaymentFailed = () => {
  const { bookingReference } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await ApiService.getBookingByReference(bookingReference);
        setBooking(response.booking);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setError("Impossibile recuperare i dettagli della prenotazione.");
      }
    };

    fetchBookingDetails();
  }, [bookingReference]);

  const handleRetryPayment = () => {
    if (booking) {
      navigate(`/payment/${bookingReference}/${booking.totalPrice}`);
    }
  };

  const handleGoHome = () => {
    navigate('/home');
  };

  return (
    <div style={{
      backgroundColor: "#222",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <Container className="text-center">
        <Card className="shadow-lg border-0">
          <Card.Body className="p-5">
            <div className="mb-4">
              <i className="fas fa-times-circle text-danger" style={{ fontSize: '4rem' }}></i>
              <h2 className="mt-3 text-dark">Pagamento Non Riuscito</h2>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {booking && (
              <div className="text-left mb-4">
                <h5 className="mb-3">Dettagli della prenotazione:</h5>
                <p><strong>Codice prenotazione:</strong> {booking.bookingReference}</p>
                <p><strong>Check-in:</strong> {booking.checkInDate}</p>
                <p><strong>Check-out:</strong> {booking.checkOutDate}</p>
                <p><strong>Importo totale:</strong> €{booking.totalPrice}</p>
              </div>
            )}

            <p className="text-muted mb-4">
              Si è verificato un problema durante l'elaborazione del pagamento. 
              Ti preghiamo di riprovare o di contattare il nostro servizio clienti.
            </p>

            <div className="d-flex justify-content-center gap-3">
              <Button onClick={handleRetryPayment} className="button-class px-4 py-2">
                Riprova Pagamento
              </Button>
              <Button onClick={handleGoHome} variant="outline-dark" className="px-4 py-2">
                Torna alla Home
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default PaymentFailed;