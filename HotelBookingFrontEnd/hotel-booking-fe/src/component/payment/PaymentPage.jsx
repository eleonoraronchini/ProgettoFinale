import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import ApiService from "../../service/ApiService";
import { Container, Row, Col, Card, Button, Alert, Spinner, Modal } from 'react-bootstrap';

// Sostituisci con la tua chiave pubblica Stripe
const stripePromise = loadStripe('pk_test_51R2BIkFtjSVg0U1y7Zj21e7ZLEC7rlT89wdZ36mmmaEI9DXYWiLr2372OCdT6rt8T6ntjsVj0C3sg9j22KmPMM8D006Wopl2Po');

const PaymentForm = ({ bookingReference, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const getPaymentIntent = async () => {
      try {
        setLoading(true);
        const paymentRequest = {
          bookingReference: bookingReference,
          amount: parseFloat(amount)
        };
        
        const clientSecret = await ApiService.proceedForPayment(paymentRequest);
        setClientSecret(clientSecret);
      } catch (error) {
        console.error("Error fetching payment intent:", error);
        setError(error.response?.data?.message || "Impossibile procedere con il pagamento. Riprova più tardi.");
      } finally {
        setLoading(false);
      }
    };

    getPaymentIntent();
  }, [bookingReference, amount]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (error) {
        setError(error.message);
        
        // Invia l'aggiornamento del pagamento fallito
        await ApiService.updateBookingPayment({
          bookingReference: bookingReference,
          amount: parseFloat(amount),
          transactionId: paymentIntent?.id || 'unknown',
          success: false,
          failureReason: error.message
        });
        
        navigate(`/payment-failed/${bookingReference}`);
      } else {
        // Invia l'aggiornamento del pagamento riuscito
        await ApiService.updateBookingPayment({
          bookingReference: bookingReference,
          amount: parseFloat(amount),
          transactionId: paymentIntent.id,
          success: true
        });
        
        navigate(`/payment-success/${bookingReference}`);
      }
    } catch (err) {
      setError("Si è verificato un errore durante l'elaborazione del pagamento. Riprova più tardi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="card-element" className="mb-2 d-block">
          Dati della carta di credito
        </label>
        <div className="p-3 border rounded" style={{ backgroundColor: '#f9f9f9' }}>
          <CardElement id="card-element" 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#32325d',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      
      <Button 
        type="submit" 
        disabled={!stripe || loading || !clientSecret} 
        className="button-class w-100"
      >
        {loading ? (
          <>
            <Spinner 
              as="span" 
              animation="border" 
              size="sm" 
              role="status" 
              aria-hidden="true" 
              className="me-2"
            />
            Elaborazione in corso...
          </>
        ) : (
          `Paga €${amount}`
        )}
      </Button>
    </form>
  );
};

const PaymentPage = () => {
  const { bookingReference, amount } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // Verifica se l'utente è autenticato
        if (!ApiService.isAuthenticated()) {
          // Mostra il modal informativo
          setShowInfoModal(true);
          return;
        }

        setLoading(true);
        const response = await ApiService.getBookingByReference(bookingReference);
        setBookingDetails(response.booking);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        setError("Impossibile recuperare i dettagli della prenotazione. Controlla il codice e riprova.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingReference, amount, navigate]);

  const handleRedirectToLogin = () => {
    // Salva i parametri di pagamento in localStorage
    localStorage.setItem('paymentPending', 'true');
    localStorage.setItem('paymentBookingReference', bookingReference);
    localStorage.setItem('paymentAmount', amount);
    
    // Chiudi il modal e reindirizza alla pagina di login
    setShowInfoModal(false);
    
    // Reindirizza alla pagina di login
    navigate("/login", { 
      state: { 
        from: { pathname: `/payment/${bookingReference}/${amount}` } 
      } 
    });
  };

  if (loading && !showInfoModal) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!bookingDetails && !showInfoModal) {
    return (
      <Container className="my-5">
        <Alert variant="warning">Prenotazione non trovata. Verifica il codice di prenotazione.</Alert>
      </Container>
    );
  }

  // Modal informativo per il login
  const loginInfoModal = (
    <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Autenticazione Richiesta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>È necessario effettuare il login prima di procedere con il pagamento.</p>
        <p>Dopo il login, sarai automaticamente reindirizzato alla pagina di pagamento.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button className="button-class" onClick={handleRedirectToLogin}>
          Procedi al Login
        </Button>
      </Modal.Footer>
    </Modal>
  );

  // Verifica se la prenotazione è già stata pagata
  if (bookingDetails?.paymentStatus === "COMPLETED") {
    return (
      <Container className="my-5">
        <Alert variant="info">
          Questa prenotazione è già stata pagata. Grazie per aver scelto PunPun Lodge.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {loginInfoModal}
      {!showInfoModal && (
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow">
              <Card.Header as="h5" className="text-center">Pagamento Prenotazione</Card.Header>
              <Card.Body>
                <div className="mb-4">
                  <h6>Dettagli Prenotazione:</h6>
                  <p className="mb-1"><strong>Codice:</strong> {bookingDetails.bookingReference}</p>
                  <p className="mb-1"><strong>Check-in:</strong> {bookingDetails.checkInDate}</p>
                  <p className="mb-1"><strong>Check-out:</strong> {bookingDetails.checkOutDate}</p>
                  <p className="mb-3"><strong>Totale da pagare:</strong> €{amount}</p>
                </div>
                
                <Elements stripe={stripePromise}>
                  <PaymentForm bookingReference={bookingReference} amount={amount} />
                </Elements>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default PaymentPage;