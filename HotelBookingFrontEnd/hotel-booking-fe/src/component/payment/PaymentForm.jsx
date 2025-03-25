import {useState} from "react";
import {CardElement, useStripe, useElements} from "@stripe/react-stripe-js";


const PaymentForm = ({clientSecrete, amount, onPaymentSuccess, onPaymentError}) =>{
    const stripe = useStripe ();
    const element = useElements ();

    const [error, setError] = useState (null);
    const [succeeded ,setSucceeded] = useState (false);
    const [processing, setProcessing] = useState (false);

    const handleSubmit = async (event) => {
        event.preventDefault ()

        if(!stripe || !element || processing) return;

        setProcessing(true);

        const {error,paymentIntent} = await stripe.confirmCardPayment(clientSecrete, {
            payment_method: {
                card: element.getElement(CardElement)
            },
        });
        console.log("PAYMENT IS:" + paymentIntent);
        
        if(error){
           setError(error.message)
           setProcessing(false)
           onPaymentError(error.message) 
        } else if (paymentIntent.status === "succeeded"){
            setSucceeded(true)
            setProcessing(false)
            onPaymentSuccess(paymentIntent.id)
        }
    }

    return (
        <div>
            <h3>Complete your payment</h3>
            <div>Amount to pay: ${parseFloat(amount).toFixed(2)}</div>
        

        <form onSubmit={handleSubmit}>
            <div>
                <CardElement/>
            </div>
            <button disabled={processing || !stripe} type="submit">{processing ? "Processing...": "Pay now"}</button>
        </form>

        {error && <p>{error}</p>}
        {succeeded && <p>Payment succeeded: thank you for your booking. </p>}
        </div>
    )
} 

export default PaymentForm