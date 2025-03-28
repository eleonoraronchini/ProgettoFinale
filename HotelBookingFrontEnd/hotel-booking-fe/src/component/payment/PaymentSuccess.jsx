import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Alert, Spinner } from 'react-bootstrap';
import ApiService from "../../service/ApiService";

const PaymentSuccess = () => {
  const { bookingReference } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // Verifica autenticazione
        if (!ApiService.isAuthenticated()) {
          navigate("/login");
          return;
        }

        setLoading(true);
        const response = await ApiService.getBookingByReference(bookingReference);
        setBooking(response.booking);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setError("Impossibile recuperare i dettagli della prenotazione.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingReference, navigate]);

  const handleGoHome = () => {
    navigate('/home');
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </Spinner>
      </Container>
    );
  }

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
              <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
              <h2 className="mt-3 text-dark">Pagamento Completato con Successo!</h2>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {booking && (
              <div className="text-left mb-4">
                <h5 className="mb-3">Dettagli della prenotazione:</h5>
                <p><strong>Codice prenotazione:</strong> {booking.bookingReference}</p>
                <p><strong>Check-in:</strong> {booking.checkInDate}</p>
                <p><strong>Check-out:</strong> {booking.checkOutDate}</p>
                <p><strong>Importo totale:</strong> €{booking.totalPrice}</p>
                <p><strong>Stato pagamento:</strong> {booking.paymentStatus}</p>
              </div>
            )}

            <p className="text-muted mb-4">Grazie per aver scelto PunPun Lodge. Abbiamo inviato una conferma alla tua email.</p>

            <Button onClick={handleGoHome} className="button-class px-4 py-2">
              Torna alla Home
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default PaymentSuccess;