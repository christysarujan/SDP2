import React, { useState, useEffect } from 'react';
import { getWishListByUserId, deleteWishByWishId, getProductsByProductId, getProductImage } from '../../services/apiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import './WishList.scss';
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

  useEffect(() => {
    const fetchUserData = () => {
      const tokenData = sessionStorage.getItem("decodedToken");
      if (tokenData) {
        const parsedUserData: UserData = JSON.parse(tokenData);
        setUserData(parsedUserData);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchWishItems();
    }
  }, [userData]);

  const fetchWishItems = async () => {
    try {
      const userId = userData?.username;
      if (userId) {
        const data = await getWishListByUserId(userId);
        const itemsWithDetails = await Promise.all(data.map(async (item: WishItem) => {
          const productDetails = await getProductsByProductId(item.productId);
          let image = '';
          const productImage = await getProductImage(productDetails.productImages[0].productImageUrl);
          image = await getProductPhoto(productImage);
          return { ...item, productDetails, image };
        }));

        setWishItems(itemsWithDetails);
      }
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
    }
  };

  const getProductPhoto = async (imageData: BlobPart) => {
    try {
      const blob = new Blob([imageData], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);
      return imageUrl;
    } catch (error) {
      console.error("Error fetching product image:", error);
      throw error;
    }
  };

  const handleDeleteWishItem = async (itemId: string) => {
    try {
      await deleteWishByWishId(itemId);
      const updatedWishItems = wishItems.filter((wishItem: WishItem) => wishItem.id !== itemId);
      setWishItems(updatedWishItems);
      setConfirmDeleteItemId(null);
    } catch (error) {
      console.error('Error deleting item from wishlist:', error);
    }
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/viewproduct/${productId}`);
  };

  return (
    <div className="wish-list-container">
      <h2>Wishlist</h2>
      <div className="wish-items-container">
        {wishItems.map((item) => (
          <div key={item.id} className="wish-item">
            <div className="wish-item-image" onClick={() => handleViewProduct(item.productId)}>
              <img src={item.image} alt={item.productDetails?.name} />
            </div>
            <div className="wish-item-details">
              <p>{item.productDetails?.name}</p>
              <p>Price: {item.productDetails?.discount === 0 ? item.productDetails?.price : item.productDetails?.newPrice}</p>
              <p>Color: <span className="color-square" style={{ backgroundColor: item.color }}></span></p>
              <p>Size: {item.size}</p>
            </div>
            <div className="wish-item-actions">
              <button onClick={() => handleViewProduct(item.productId)}>
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button onClick={() => setConfirmDeleteItemId(item.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {confirmDeleteItemId && (
        <div className="delete-confirmation-modal">
          <div className="confirmation-box">
            <p>Are you sure you want to delete this item?</p>
            <div>
              <button onClick={() => handleDeleteWishItem(confirmDeleteItemId)}>Yes</button>
              <button onClick={() => setConfirmDeleteItemId(null)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewWishPage;
