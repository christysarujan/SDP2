import React, { useState, useEffect } from 'react';
import { getCartsByUserId, updateCartQuantity, deleteCartByUserIdAndCartId, getProductsByProductId, getProductImage, getWishListByUserId, deleteWishByWishId } from '../../services/apiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faShoppingCart , faEye } from '@fortawesome/free-solid-svg-icons';
import './WishList.scss';
//import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

interface WishItem {
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

function ViewWishPage() {
  const [wishItems, setWishItems] = useState<WishItem[]>([]);
  const [confirmDeleteItemId, setConfirmDeleteItemId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();
  //const { setCartCount } = useCart();

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
    fetchWishItems();
  }, [userData]);

  useEffect(() => {
    calculateTotalPrice();
  }, [wishItems]);

  const fetchWishItems = async () => {
    try {
      if (userData) {
        const userId = userData.username;
        const data = await getWishListByUserId(userId);
        const itemsWithDetails = await Promise.all(data.map(async (item: WishItem) => {
          const productDetails = await getProductsByProductId(item.productId);
          let image = '';
          const productImage = await getProductImage(productDetails.productImages[0].productImageUrl);
          image = await getProductPhoto(productImage);
          return { ...item, productDetails, image };
        }));
        
        setWishItems(itemsWithDetails);

        //const updatedCartCount = data.reduce((total: any, item: any) => total + item.quantity, 0);
        const updatedCartCount = data.length;
    

    //  setCartCount(updatedCartCount);
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

  /*
  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      await updateCartQuantity(itemId, { quantity: newQuantity });
      const updatedCartItems = wishItems.map(cartItem => {
        if (cartItem.id === itemId) {
          return { ...cartItem, quantity: newQuantity };
        }
        return cartItem;
      });
      setWishItems(updatedCartItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };
*/
  const handleDeleteWishItem = async (itemId: string) => {
    try {
      // Delete the item from the cart
     // await deleteCartByUserIdAndCartId(userData?.username || '', itemId);
     await deleteWishByWishId(itemId);
     
      // Update the cart items state by filtering out the deleted item
      const updatedWishItems = wishItems.filter((wishItem: any) => wishItem.id !== itemId);
      
      setWishItems(updatedWishItems);
      setConfirmDeleteItemId(null);
  
      // Fetch cart items again to ensure the latest data is displayed
     // /const updatedCartItemsData = await getCartsByUserId(userData?.username || '');
     // const updatedCartCount = updatedCartItemsData.reduce((total: any, item: any) => total + item.quantity, 0);
     // sessionStorage.setItem('cartCount', updatedCartCount.toString());
     //const updatedCartCount = updatedCartItemsData.length;
     //setCartCount(updatedCartCount);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
    

  const calculateTotalPrice = () => {
    return wishItems.reduce((total, item) => {
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

  const handleViewProduct = (item: WishItem) => {
    navigate(`/viewproduct/${item.productId}`);
    console.log("View Product logic goes here");
  };

  return (
    <div className="view-cart-container">
      <h2 style={{ marginLeft: '200px' }}>View Wish List</h2>
      <table className="cart-items">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Price</th>
            <th>Color</th>
            <th>Size</th>
           
            <th>View Product</th>
            <th>Remove</th>
           
          </tr>
        </thead>
        <tbody>
          {wishItems.map(item => (
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
                <button >
                  
                  <FontAwesomeIcon icon={faEye} onClick={() => handleViewProduct(item)} />

                </button>
              </td>
             
              <td>
                <button onClick={() => openDeleteConfirmation(item.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
              
            </tr>
          ))}
        </tbody>
       
      </table>
      {confirmDeleteItemId && (
        <div className="delete-confirmation-modal">
          <div className="confirmation-box">
            <p>Are you sure you want to delete this item?</p>
            <div>
              <button onClick={() => handleDeleteWishItem(confirmDeleteItemId)}>Yes</button>
              <button onClick={closeDeleteConfirmation}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewWishPage;
