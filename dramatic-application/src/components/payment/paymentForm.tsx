import React, { useState, useEffect, ChangeEvent } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { axiosInstance } from '../../services/Interceptor';
import './PaymentForm.scss'; // Import the SCSS file
import { useLocation } from 'react-router-dom';

function PaymentForm() {
    const [amount, setAmount] = useState<number>(0); // Initialize as a number
    const [currency, setCurrency] = useState('LKR');
    const [message, setMessage] = useState('');
    const stripe = useStripe();
    const elements = useElements();

    const location = useLocation();

    interface OrderItem {
        image: string;
        productName: string;
        productPrice: number;
        color: string;
        size: string;
        quantity: number;
        deliveryCharge: number;
        newFinalTotal: number;
        orderId: string;
    }

    const orderDetailsArray: OrderItem[] | undefined = location.state?.orderDetailsArray;

    let totalPriceSum: number = 0;

    if (orderDetailsArray !== undefined) {
        totalPriceSum = orderDetailsArray.reduce((total, item) => total + item.newFinalTotal, 0);
        console.log(totalPriceSum);
    } else {
        console.log("orderDetailsArray is undefined");
    }

    useEffect(() => {
        setAmount(totalPriceSum); // Update amount when totalPriceSum changes
    }, [totalPriceSum]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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

            const response = await axiosInstance.post('http://localhost:8084/api/v1/payment-management-service/payment/create-payment-intent', {

                orderIds: orderDetailsArray?.map(order => order.orderId),

                amount: totalPriceSum,
                tokenId: token.id,
                currency,
            }, {
                headers: {
                    Authorization: 'Bearer sk_test_51P18p1IDcLWdvLLXcFaCdKAxk3G7wx8X4fLbVMFOXRnkAn9jY0ieskYm6tdqJIzWSybHOwqcYh8k3sj5gv6a7CqO00Zh1gJNek',
                    'Content-Type': 'application/json'
                }
            });

            if (response && response.data) {
                setMessage(response.data);
            } else {
                setMessage("Unexpected response format");
            }
        } catch (error) {
            setMessage("An error occurred while processing your request.");
        }
    };

    return (
        <div className="payment-form-container">
            <h2>Create Payment Intent</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Amount:</label>
                    <input type="text" value={amount} onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(parseInt(e.target.value))} />
                </div>
                <div>
                    <label>Currency:</label>
                    <input type="text" value={currency} onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrency(e.target.value)} />
                </div>
                <div>
                    <label>Card Details:</label>
                    <CardElement className="StripeElement" />
                </div>
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default PaymentForm;
