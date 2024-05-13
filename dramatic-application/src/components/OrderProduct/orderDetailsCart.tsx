import React, { useEffect, useState } from 'react';
import './OrderDetailsCart.scss'; // Import the SCSS file
import { Socket, io } from 'socket.io-client';
import { useLocation, useNavigate } from 'react-router-dom';
//import Stomp from 'stompjs';



interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    addresses: {
        addressType: string;
        addressLine01: string;
        addressLine02: string;
        city: string;
        province: string;
        zipCode: string;
        country: string;
        countryCode: string;
        mobileNo: string;
    }[];
}

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

function OrderDetailsCart() {


    const navigate = useNavigate();
    // Function to check if user is logged in and retrieve userId from sessionStorage
    // Retrieve user details from sessionStorage
    const userId = sessionStorage.getItem("userId");

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



    const userDataString = sessionStorage.getItem("fullUserData");
    const userData: UserData | null = userDataString ? JSON.parse(userDataString) : null;

    const location = useLocation();
    const orderDetailsArray: OrderItem[] | undefined = location.state?.orderDetailsArray;

    if (!orderDetailsArray) {
        return <div>No order details available.</div>;
    }

    // Calculate total price sum
    const totalPriceSum = orderDetailsArray.reduce((total, item) => total + item.newFinalTotal, 0);

    const handlePayNow = () => {
        // Log the total price
        console.log("Total Price:", totalPriceSum);
        // Add logic to handle payment here
        console.log("Payment processing...");

        navigate('/payment', {
            state: { orderDetailsArray }
        });
    };

    // Inside the return statement of OrderDetailsCart component

    return (
        <div className="order-details-container">
            {/* User Data */}
            {userData && (
                <div className="user-details">
                    <h2>User Details</h2>
                    <ul>
                        <li>Full Name: {userData.firstName} {userData.lastName}</li>
                        <li>Email: {userData.email}</li>
                        {/* Display first address */}
                        {userData.addresses && userData.addresses.length > 0 &&  (
                            <li>
                                <strong>Address Details:</strong><br />
                                {userData.addresses[0]?.addressType} - {userData.addresses[0]?.addressLine01}, {userData.addresses[0]?.addressLine02}, {userData.addresses[0]?.city}, {userData.addresses[0]?.province}, {userData.addresses[0]?.zipCode}, {userData.addresses[0]?.country}
                            </li>
                        )}
                        {/* Display first phone number */}
                        {userData.addresses && userData.addresses.length > 0 && (
                            <li>
                                <strong>Mobile Number:</strong><br />
                                {userData.addresses[0]?.countryCode} {userData.addresses[0]?.mobileNo}
                            </li>
                        )}
                    </ul>
                </div>
            )}

            {/* Order Details */}
            <h2>Order Summary Details</h2>
            {orderDetailsArray.map((item: OrderItem, index: number) => (
                <div className="order-item" key={index}>
                    <div className="image-container">
                        <img src={item.image} alt={''} />
                    </div>
                    <div className="details">
                        <div className="product-info">
                            <h3>{item.productName}</h3>
                            <p>Price: Rs. {item.productPrice}</p>
                            <p>Color: <span className="color-square" style={{ backgroundColor: item.color }}></span></p>
                            <p>Size: {item.size}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Delivery Charge: Rs. {item.deliveryCharge}</p>
                            {item.orderId === "outofstock" ? (
                                <p style={{ color: 'red', fontSize: 'larger' }}>Out Of Stock</p>
                            ) : (
                                <p>
                                    Order Id : {item.orderId}
                                </p>
                            )}

                        </div>
                        <div className="price">
                            <p>Total Price: Rs. {item.newFinalTotal}</p>
                        </div>
                    </div>
                </div>
            ))}
            <div className="total-section">

                <p className="total-price" style={{ fontSize: '20px', fontWeight: 'bold' }}>Total: Rs. {totalPriceSum.toFixed(2)}</p>
            </div>
            {/* Pay Now Button */}
            <button className="pay-now-button" onClick={handlePayNow}>Pay Now</button>
        </div>
    );

}

export default OrderDetailsCart;
