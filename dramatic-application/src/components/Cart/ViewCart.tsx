import React, { useState, useEffect } from 'react';
import { getCartsByUserId, updateCartQuantity, deleteCartByUserIdAndCartId, getProductsByProductId, getProductImage } from '../../services/apiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import './ViewCart.scss';
import { useCart } from './CartContext';

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
  }, [userData]);

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

  const handleBuyItems = () => {
    // Implement your buy items logic here
    console.log("Buy items logic goes here");
  };

  return (
    <div className="view-cart-container">
      <h2 style={{ marginLeft: '200px' }}>View Cart</h2>
      <table className="cart-items">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Price</th>
            <th>Color</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Remove</th>
            <th>Checkout</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.id} className="cart-item">
              <td>
                <img src={item.image} alt={''} />
              </td>
              <td>
                <div className="item-details">
                  <p>{item.productDetails?.name}</p>
                </div>
              </td>
              <td>{item.productDetails?.discount === 0 ? item.productDetails?.price : item.productDetails?.newPrice}</td>
              <td>
                <span className="color-square" style={{ backgroundColor: item.color }}></span>
              </td>
              <td>{item.size}</td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={e => handleQuantityChange(item.id, parseInt(e.target.value))}
                  className="quantity-input"
                />
              </td>
              <td>{item.productDetails?.discount === 0 ? item.productDetails?.price * item.quantity : item.productDetails?.newPrice * item.quantity}</td>
              <td>
                <button onClick={() => openDeleteConfirmation(item.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
              <td>
                <button onClick={handleBuyItems}>
                  <FontAwesomeIcon icon={faShoppingCart} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={6}>Total</td>
            <td colSpan={2}>{calculateTotalPrice().toFixed(2)}</td>
            <td colSpan={2}>
              <button onClick={handleBuyItems}>Buy All Items</button>
            </td>
          </tr>
        </tfoot>
      </table>
      {confirmDeleteItemId && (
        <div className="delete-confirmation-modal">
          <div className="confirmation-box">
            <p>Are you sure you want to delete this item?</p>
            <div>
              <button onClick={() => handleDeleteCartItem(confirmDeleteItemId)}>Yes</button>
              <button onClick={closeDeleteConfirmation}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewCartPage;
