import React, { useState, useEffect } from 'react';
import { getCartsByUserId, updateCartQuantity, deleteCartByUserIdAndCartId, getProductsByProductId, getProductImage, addOrder, calculateCostByOrderIdandProductId, getOrderById, getcostById } from '../../services/apiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import './ViewCart.scss';
import { useCart } from './CartContext';
import { Link, useNavigate } from 'react-router-dom';

interface CartItem {
  id: string;
  productImageUrl: string;
  productId: string;
  color: string;
  size: string;
  quantity: number;
  productDetails?: any;
  image: string;
}

interface UserData {
  sub: string;
  role: string;
  verificationStatus: string;
  iss: string;
  exp: number;
  iat: number;
  email: string;
  username: string;
}

function ViewCartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [confirmDeleteItemId, setConfirmDeleteItemId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { setCartCount } = useCart();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const divStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold'
  };

  useEffect(() => {
    const fetchUserData = () => {
      const tokenData = sessionStorage.getItem("decodedToken");
      if (tokenData) {
        const parsedUserData: UserData = JSON.parse(tokenData);
        console.log("user Data...", parsedUserData);
        setUserData(parsedUserData);

      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [userData, selectedItems]);

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const userId = sessionStorage.getItem("userId");
      if (userData && userId) {

        const data = await getCartsByUserId(userId);
        const itemsWithDetails = await Promise.all(data.map(async (item: CartItem) => {
          const productDetails = await getProductsByProductId(item.productId);
          let image = '';
          const productImage = await getProductImage(productDetails.productImages[0].productImageUrl);
          image = await getProductPhoto(productImage);
          return { ...item, productDetails, image };
        }));

        setCartItems(itemsWithDetails);

        const updatedCartCount = data.length;
        setCartCount(updatedCartCount);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const getProductPhoto = async (imageData: BlobPart) => {
    try {
      const blob = new Blob([imageData], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);
      return imageUrl;
    } catch (error) {
      console.error("Error fetching profile image:", error);
      throw error;
    }
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      await updateCartQuantity(itemId, { quantity: newQuantity });
      const updatedCartItems = cartItems.map(cartItem => {
        if (cartItem.id === itemId) {
          return { ...cartItem, quantity: newQuantity };
        }
        return cartItem;
      });
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleDeleteCartItem = async (itemId: string) => {
    const userId = sessionStorage.getItem("userId");
    try {
      // Delete the item from the cart
      await deleteCartByUserIdAndCartId(userId || '', itemId);

      // Update the cart items state by filtering out the deleted item
      const updatedCartItems = cartItems.filter((cartItem: any) => cartItem.id !== itemId);

      setCartItems(updatedCartItems);
      setConfirmDeleteItemId(null);

      // Fetch cart items again to ensure the latest data is displayed
      const updatedCartItemsData = await getCartsByUserId(userId || '');
      const updatedCartCount = updatedCartItemsData.length;
      setCartCount(updatedCartCount);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };


  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.productDetails?.discount === 0 ? item.productDetails?.price : item.productDetails?.newPrice;
      return total + price * item.quantity;
    }, 0);
  };

  const openDeleteConfirmation = (itemId: string) => {
    setConfirmDeleteItemId(itemId);
  };

  const closeDeleteConfirmation = () => {
    setConfirmDeleteItemId(null);
  };

  const handleCheckboxChange = (itemId: string) => {
    setSelectedItems(prevSelectedItems =>
      prevSelectedItems.includes(itemId)
        ? prevSelectedItems.filter(id => id !== itemId)
        : [...prevSelectedItems, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      // If all items are selected, unselect all
      setSelectedItems([]);
    } else {
      // Otherwise, select all items
      setSelectedItems(cartItems.map(item => item.id));
    }
  };




  const handleBuyItems = async () => {
    try {
      const orderDetailsArray = []; // Array to store order details

      const selectedItemsData = cartItems.filter(item => selectedItems.includes(item.id));

      for (const item of selectedItemsData) {
        // Add order for the current item
        const receivedOrderObject = await addOrder({
          productId: item.productId,
          userId: sessionStorage.getItem("userId") || null,
          color: item.color,
          size: item.size,
          quantity: item.quantity
        });

        console.log("Item...", item)

        console.log("Received Object...", receivedOrderObject)

        var deliveryCharge = receivedOrderObject.deliveryChargeAmount;

        // Calculate cost for the order
        await calculateCostByOrderIdandProductId({
          productId: item.productId,
          orderId: receivedOrderObject.id
        });

        // Wait until the cost is updated
        let updatedOrderObject = await getOrderById(receivedOrderObject.id);
        const startTime = new Date().getTime(); // Get current time in milliseconds
        while (updatedOrderObject.costId === null) {
          updatedOrderObject = await getOrderById(receivedOrderObject.id);
          if (updatedOrderObject.costId !== null) {
            break;
          }
          const currentTime = new Date().getTime(); // Get current time in milliseconds
          const elapsedTime = currentTime - startTime; // Calculate elapsed time
          if (elapsedTime >= 20000) {

            console.log("=== Time limit exceeded. Exiting loop ===");
            console.log("=== Cost Id not updated in Cart DB ===");
            console.log("=== Please Check Kafka Server ===");
            console.log("=== Try To Clean logs and Try to Restart Kafka Server  ===");
            break;

          }
          await new Promise(resolve => setTimeout(resolve, 1000)); // Add a delay before next iteration
        }

        var costDetails;
        // If cost is updated, fetch the cost details
        if (updatedOrderObject.costId !== null) {
          costDetails = await getcostById(updatedOrderObject.costId);
          console.log("Cost Details ..", costDetails)
          // Perform any operations with costDetails if needed
        }

        // Push order details for the current item to the array
        orderDetailsArray.push({
          productId: item.productId,
          productName: item.productDetails?.name,
          productPrice: item.productDetails?.price,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          image: item.image,
          newFinalTotal: costDetails.finalTotal,
          deliveryCharge: deliveryCharge,
          orderId : receivedOrderObject.id
          
        });
      }

      sessionStorage.setItem("orderDetails", JSON.stringify(orderDetailsArray));

      // After processing all items, navigate to the order page
      navigate('/orderDetailsCart', {
        state: { orderDetailsArray }
      });
      // window.location.reload();

      const userId = sessionStorage.getItem("userId");

      // fetchCartItems();
      if (userId) {

        const data = await getCartsByUserId(userId);
        const updatedCartCount = data.length;
        setCartCount(updatedCartCount);

      }

    } catch (error) {
      console.error('Error buying items:', error);
    }
  };


  const handleRecentCheckout = () => {
    try {
      const orderDetailsArrayString = sessionStorage.getItem("orderDetails");
      if (orderDetailsArrayString) {
        const orderDetailsArray = JSON.parse(orderDetailsArrayString);
        navigate('/orderDetailsCart', {
          state: { orderDetailsArray }
        });
      }
    } catch (error) {
      console.error('Error handling recent checkout:', error);
    }
  };

  return (
    <div className="view-cart-container">
      <h2 className="view-cart-heading">View Cart</h2>
      <div className="cart-items-container">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item-list">
            <div className="cart-item-list-image">
              <img src={item.image} alt={''} />
            </div>
            <div className="cart-item-list-details">
              <p className="cart-item-list-name">{item.productDetails?.name}</p>
              <p className="cart-item-list-price">Rs.{item.productDetails?.discount === 0 ? item.productDetails?.price : item.productDetails?.newPrice}</p>
              <div className="cart-item-list-color" style={{ backgroundColor: item.color }}></div>
              <p className="cart-item-list-size">Size: {item.size}</p>
              <div className="cart-item-list-actions">
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={e => handleQuantityChange(item.id, parseInt(e.target.value))}
                  className="cart-item-list-quantity"
                />
                <p className="cart-item-list-total">Total: Rs.{item.productDetails?.discount === 0 ? item.productDetails?.price * item.quantity : item.productDetails?.newPrice * item.quantity}</p>
                <button className="delete-item-button" onClick={() => setConfirmDeleteItemId(item.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <div style={divStyle} className="checkout-checkbox">
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(item.id)}
                    className="inner-checkbox"
                  />
                  <span>Checkout</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="checkout-options-container">
        <label className="checkout-all-label">
          <input
            type="checkbox"
            checked={selectedItems.length === cartItems.length && cartItems.length !== 0}
            onChange={handleSelectAll}
            className="checkout-all-checkbox"
          />
          <span style={divStyle}>Checkout All</span>
        </label>
        <div className="total-price-container">
          <span className="total-price-label">Total:</span>
          <span className="total-price-amount">Rs.{calculateTotalPrice().toFixed(2)}</span>
        </div>
        <button className="recent-orders-button" onClick={handleRecentCheckout}>Recent Orders</button>
        <button className="buy-items-button" onClick={handleBuyItems}>Buy Items</button>
      </div>
  
      {confirmDeleteItemId && (
        <div className="delete-confirmation-modal">
          <div className="confirmation-box">
            <p className="confirmation-message">Are you sure you want to delete this item?</p>
            <div className="confirmation-buttons">
              <button className="confirmation-yes-button" onClick={() => handleDeleteCartItem(confirmDeleteItemId)}>Yes</button>
              <button className="confirmation-no-button" onClick={() => setConfirmDeleteItemId(null)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
    }

export default ViewCartPage;
