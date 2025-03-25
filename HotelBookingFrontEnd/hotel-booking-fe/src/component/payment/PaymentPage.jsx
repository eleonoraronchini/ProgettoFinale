import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaymentForm from "./PaymentForm";
import ApiService from "../../service/ApiService";
import { Card, Alert, Spinner } from "react-bootstrap";

const PaymentPage = () => {
  const { bookingReference, amount } = useParams();
  const [clientSecrete, setClientSecrete] = useState(null);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientSecrete = async () => {
      try {
        const paymentData = { bookingReference, amount };
        console.log("BOOKING N. " + bookingReference);
        console.log("Amount is: " + amount);

        const token = localStorage.getItem("authToken");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        };

        const uniquePaymentSecrete = await ApiService.proceedForPayment(
          paymentData
        );
        console.log(
          "UNIQUE CLIENT SECRETE FROM fetchClientSecrete is: " +
            uniquePaymentSecrete
        );
        setClientSecrete(uniquePaymentSecrete);
      } catch (error) {
        console.log(error);
        setError(error.response?.data?.message || error.message);
      }
    };
    fetchClientSecrete();
  }, [bookingReference, amount]);

  if (error) {
    return (
      <div className="error-message">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  const stripePromise = loadStripe(
    "pk_test_51R2BIkFtjSVg0U1y7Zj21e7ZLEC7rlT89wdZ36mmmaEI9DXYWiLr2372OCdT6rt8T6ntjsVj0C3sg9j22KmPMM8D006Wopl2Po"
  );

  return (
    <div className="payment-page">
      <Card className="payment-card">
        <Card.Body>
          <h3>Payment Details</h3>
          <div className="amount-display mb-3">
            <strong>Amount: $ {parseFloat(amount).toFixed(2)}</strong>
          </div>

          {clientSecrete === null ? (
            <div className="loading-spinner">
              <Spinner animation="border" variant="primary" />
              <span>Loading payment information...</span>
            </div>
          ) : (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret: clientSecrete }}
            >
              <PaymentForm
                clientSecrete={clientSecrete}
                amount={amount}
                onPaymentSuccess={(transactionId) => {
                  setPaymentStatus("succeeded");
                  // handlePaymentStatus("succeeded", transactionId);
                  navigate(`/payment-success/${bookingReference}`);
                }}
                onPaymentError={(error) => {
                  setPaymentStatus("failed");
                  // handlePaymentStatus("failed", "", error.message);
                  navigate(`/payment-failed/${bookingReference}`);
                }}
              />
            </Elements>
          )}

          {paymentStatus && (
            <div className="payment-status mt-3">
              <Alert
                variant={paymentStatus === "succeeded" ? "success" : "danger"}
              >
                Payment {paymentStatus}:{" "}
                {paymentStatus === "succeeded"
                  ? "Thank you for your booking!"
                  : "There was an issue with your payment."}
              </Alert>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default PaymentPage;
