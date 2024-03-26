import React from 'react';
import { useLocation } from 'react-router-dom';
import './OrderProduct.scss'; // Import the SCSS file

interface OrderPageProps {
  productId: string;
  // other props that OrderPage might expect
}

const OrderPage: React.FC<OrderPageProps> = ({ productId }) => {
  const location = useLocation();
  const orderDetails = location.state && location.state.orderDetails;
  const deliveryCharge = location.state && location.state.deliveryCharge;
  const finalTotal = location.state && location.state.newFinalTotal;

  // Retrieve user details from sessionStorage
  const userDataString = sessionStorage.getItem("fullUserData");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  return (
    <div className='place-order-container'>
      <div className='place-order'>
        <h1>Order Confirmation</h1>
        <div className='image-details-content'>
          <div className='image-container'>
            {orderDetails.images && (
              <li>
                {/* Product Images: */}
                <div className="product-images">
                  {orderDetails.images.map((image: string | undefined, index: number) => (
                    <img key={index} src={image} className="product-image" />
                  ))}
                </div>
              </li>
            )}
          </div>
          <div className='details-content'>
            {orderDetails && (
              <div>
                <ul className='list-item'>
                <strong>Product Details:</strong><br />
                  <li>Product Name: {orderDetails.productName}</li>
                  <li>Product Price: {orderDetails.productPrice}</li>
                  <li>Product color: {orderDetails.color}</li>
                  <li>Product size: {orderDetails.size}</li>
                  <li>Product quantity: {orderDetails.quantity}</li>
                  <li>Delivery Charge: {deliveryCharge}</li>
                  <li>Final Total: {finalTotal}</li>
                </ul>
              </div>
            )}

            {userData && (
              <div>
                <ul>
                  <li>Full Name: {userData.firstName} {userData.lastName}</li>
                  
                  <li>Email: {userData.email}</li>
                  {/* Display first address */}
                  {userData.addresses.length > 0 && (
                    <li>
                      <strong>Address Details:</strong><br />
                      {userData.addresses[0].addressType} - {userData.addresses[0].addressLine01}, {userData.addresses[0].addressLine02}, {userData.addresses[0].city}, {userData.addresses[0].province}, {userData.addresses[0].zipCode}, {userData.addresses[0].country}
                    </li>
                  )}
                  {/* Display first phone number */}
                  {userData.addresses.length > 0 && (
                    <li>
                      <strong>Mobile Number:</strong><br />
                      {userData.addresses[0].countryCode} {userData.addresses[0].mobileNo}
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
