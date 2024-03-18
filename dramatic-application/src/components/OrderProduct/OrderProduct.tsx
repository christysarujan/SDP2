import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './OrderProduct.scss'; // Import the SCSS file

interface OrderPageProps {
  productId: string;
  // other props that OrderPage might expect
}

const OrderPage: React.FC<OrderPageProps> = ({ productId }) => {
  const location = useLocation();
  const orderDetails = location.state && location.state.orderDetails;

  // Retrieve user details from sessionStorage
  const userDataString = sessionStorage.getItem("fullUserData");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedMobile, setSelectedMobile] = useState<string>('');

  const handleAddressChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAddress(event.target.value);
    console.log("Selected Address: ", event.target.value);
  };

  const handleMobileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMobile(event.target.value);
    console.log("Selected Mobile Number: ", event.target.value);
  };

  return (
    <div className='place-order-container container'>
      <div className="place-order-page row">
        <div className="place-order-details col-md-5">
          <h1>Order Summary</h1>
        
          {orderDetails && (
            <div>
              <h2>Product Details:</h2>
              <ul>
                <li>Product ID: {orderDetails.productId}</li> 
                <li>Product Name: {orderDetails.productName}</li>
                <li>Product Price: {orderDetails.productPrice}</li>
                <li>Product color: {orderDetails.color}</li>
                <li>Product size: {orderDetails.size}</li>
                <li>Product quantity: {orderDetails.quantity}</li>
                {/* Display product images */}
                {orderDetails.images && (
                  <li>
                    Product Images:
                    <div className="product-images">
                      {orderDetails.images.map((image: string | undefined, index: number) => (
                        <img key={index} src={image} alt={`Product Image ${index}`} className="product-image" />
                      ))}
                    </div>
                  </li>
                )}
                {/* Add more details as needed */}
              </ul>
            </div>
          )}
          {/* Display user details */}
          {userData && (
            <div>
              <h2>User Details</h2>
              <ul>
                {/* <li>ID: {userData.id}</li> */}
                <li>First Name: {userData.firstName}</li>
                <li>Last Name: {userData.lastName}</li>
                <li>Email: {userData.email}</li>
                {/* <li>Gender: {userData.gender}</li> */}
                {/* <li>Date of Birth: {userData.dob}</li> */}
                {/* <li>Profile Status: {userData.profileStatus}</li> */}
                {/* <li>Verification Status: {userData.verificationStatus}</li> */}
                {/* Render addresses as dropdowns */}
                <li>
                  <strong>Address Details:</strong><br />
                  <select value={selectedAddress} onChange={handleAddressChange}>
                    <option value="">Select an address</option>
                    {userData.addresses.map((address: any) => (
                      <option key={address.id} value={address.addressType + ' - ' + address.addressLine01 + ' ' + address.addressLine02 + ' ' + address.city + ' ' + address.zipCode + ' ' + address.province + ' ' + address.country}>
                        {address.addressType} - {address.addressLine01},{address.addressLine02} ,{address.city}, {address.province}, {address.zipCode},{address.country}
                      </option>
                    ))}
                  </select>
                </li>
                <li>
                  <strong>Mobile Number:</strong><br />
                  <select value={selectedMobile} onChange={handleMobileChange}>
                    <option value="">Select a mobile number</option>
                    {userData.addresses.map((address: any) => (
                      <option key={address.id} value={address.countryCode + ' ' + address.mobileNo}>
                        {address.addressType} {address.countryCode} {address.mobileNo}
                      </option>
                    ))}
                  </select>
                </li>
                {/* Add more user details as needed */}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
