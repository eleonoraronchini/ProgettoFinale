import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, Card, Form, Alert } from "react-bootstrap";

const PaymentForm = ({ clientSecrete, amount, onPaymentSuccess, onPaymentError }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [error, setError] = useState(null);
    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || processing) return;

        setProcessing(true);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecrete, {
            payment_method: {
                card: elements.getElement(CardElement)
            },
        });

        console.log("PAYMENT IS:" + paymentIntent);

        if (error) {
            setError(error.message);
            setProcessing(false);
            onPaymentError(error.message);
            console.log("Error paymentForm is: " + error);
        } else if (paymentIntent.status === "succeeded") {
            console.log("PaymentForm is successful: " + paymentIntent);

            setSucceeded(true);
            setProcessing(false);
            onPaymentSuccess(paymentIntent.id);
        }
    };

    return (
        <Card className="payment-form">
            <Card.Body>
                <h3>Complete your Payment</h3>
                <div className="amount-display mb-3">
                    <strong>Amount to pay: $ {parseFloat(amount).toFixed(2)} </strong>
                </div>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                        <div className="card-element-container">
                            <CardElement />
                        </div>
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        className="payment-button"
                        disabled={processing || !stripe}
                    >
                        {processing ? "Processing..." : "Pay now"}
                    </Button>
                </Form>

                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                {succeeded && <Alert variant="success" className="mt-3">Payment succeeded: Thank you for your booking!</Alert>}
            </Card.Body>
        </Card>
    );
};

export default PaymentForm;
