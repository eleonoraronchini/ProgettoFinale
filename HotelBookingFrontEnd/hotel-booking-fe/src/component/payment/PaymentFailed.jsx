import { useParams } from "react-router-dom";

const PaymentFailed = () =>{
    const {bookingReference} = useParams();
    return (
        <div>
            <h2>Payment failed</h2>
            <p>Your payment for booking reference {bookingReference} failed.</p>
        </div>
    )
}

export default PaymentFailed;