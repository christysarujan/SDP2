import React, { useState, useEffect, ChangeEvent } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosInstance } from '../../services/Interceptor';
import './PaymentForm.scss'; // Import the SCSS file

function PaymentForm() {
    const [amount, setAmount] = useState<number>(0);
    const [currency, setCurrency] = useState('LKR');
    const [message, setMessage] = useState('');
    const [paymentMade, setPaymentMade] = useState(false); // State variable to track payment status
    const [showPopup, setShowPopup] = useState(false); // State variable to control popup visibility
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const location = useLocation();

    interface OrderItemDTO {
        image: string;
        productId: string;
        productName: string;
        productPrice: number;
        color: string;
        size: string;
        quantity: number;
        deliveryCharge: number;
        newFinalTotal: number;
        orderId: string;
    }

    const orderDetailsArray: OrderItemDTO[] | undefined = location.state?.orderDetailsArray;

    let totalPriceSum: number = 0;

    if (orderDetailsArray !== undefined) {
        totalPriceSum = orderDetailsArray.reduce((total, item) => total + item.newFinalTotal, 0);
    }

   

// Payment Delay Processing Using SSE (SERVER SENT EVENT)

const userId = sessionStorage.getItem("userId");

console.log("User Id : " , userId)

useEffect(() => {
  const eventSource = new EventSource(`http://localhost:8083/api/v1/product-service/products/sse/${userId}`);
 

  eventSource.onopen = () => {
    console.log("SSE connection opened");
  };

  eventSource.onerror = (error) => {
    console.error("SSE error:", error);
  };

  const paymentStatusListener = (event: { data: any; }) => {
    console.log("Payment status received:", event.data);
    // Display a message box
    sessionStorage.removeItem("orderDetails");
    alert("Payment status received: " + event.data);

     // Navigate to root URL
     window.location.href = "/";
  };

  eventSource.addEventListener("paymentStatus", paymentStatusListener);

  return () => {
    eventSource.removeEventListener("paymentStatus", paymentStatusListener);
    eventSource.close();
    console.log("SSE connection closed");
  };
}, [userId]); // Close a

///////////END OF SERVER SENT EVENT/////////////////////


/// PAYMENT PPROCESSING USING STRIPE


useEffect(() => {
    setAmount(totalPriceSum); // Initialize amount with default value
    return () => {
        // Clear state upon component unmount
        setAmount(0);
        setCurrency('LKR');
        setMessage('');
        setPaymentMade(false);
    };
}, []); // Empty dependency array to run only once on mount

    const handlePopupClose = () => {
        setShowPopup(false);
       
        navigate('/deliverySummery', {
            state: { orderDetailsArray , message}
          });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (paymentMade) {
            setMessage("You have already made a payment. Please buy a new order.");
            setAmount(0);
            setCurrency('LKR');
            return;
        }

        try {
            if (!stripe || !elements) {
                return;
            }

            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                setMessage("Card input is not available.");
                return;
            }

            const { token, error } = await stripe.createToken(cardElement);

            if (error) {
                setMessage(error.message || "An error occurred while processing your request.");
                return;
            }

            console.log("Order Details Array.." , orderDetailsArray)

            const response = await axiosInstance.post('http://localhost:8084/api/v1/payment-management-service/payment/create-payment-intent', {
                OrderItems: orderDetailsArray,
                amount: totalPriceSum,
                tokenId: token.id,
                currency,
            }, {
                
            });

            if (response && response.data) {
                setMessage(response.data);
                setPaymentMade(true); // Set payment status to true after successful payment
                setShowPopup(true); // Show popup after successful payment
            } else {
                setMessage("Unexpected response format");
            }
        } catch (error) {
            setMessage("An error occurred while processing your request.");
        }
    };

    return (
        <div className="payment-form-container">
            <h2>Create Payment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Amount:</label>
                    <input type="text" value={amount} readOnly />
                </div>
                <div>
                    <label>Currency:</label>
                    <input type="text" value={currency} onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrency(e.target.value)} />
                </div>
                <div>
                    <label>Card Details:</label>
                    <CardElement className="StripeElement" options={{ hidePostalCode: true }} />
                </div>
                <button type="submit">Create Payment</button>
            </form>
            {message && <p>{message}</p>}
            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <p>Payment Successful!</p>
                        <button onClick={handlePopupClose}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PaymentForm;
