import React, { useState, useEffect } from 'react';
import './ProductPage.scss';
import { getProductsByProductId, getProductImage, findStoreByEmail, addToCart, getCartsByUserId, addToWishList, addToReviewFeedback, getFeedBackById } from '../../../services/apiService';
import ReactImageMagnify from 'react-image-magnify';
import { useCart } from '../../Cart/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Rating from 'react-rating-stars-component';
import 'react-tabs/style/react-tabs.scss';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

interface Product {
  name: string;
  image: string;
  description: string;
  price: string;
  brand: string;
  availability: boolean;
  sizes: string[];
  variations?: Variation[];
  sellerEmail: string;
  discount: number;
  newPrice: string;
}

interface ProductPageProps {
  productId: string;
}

interface SizeQuantity {
  size: string;
  qty: number;
}

interface Variation {
  color: string;
  sizeQuantities: SizeQuantity[];
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

interface Feedback {
  id?: string;
  userId: string;
  productId: string;
  comment: string;
  rating: number;
  uploadImageList?: File[];
}

const ProductPage: React.FC<ProductPageProps> = (props) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [storeDetails, setStoreDetails] = useState<any | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { setCartCount } = useCart();
  const [bump, setBump] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [reviews, setReviews] = useState<Feedback[]>([]);
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false); // Add a dummy state variable

  useEffect(() => {
    const tokenData = sessionStorage.getItem("decodedToken");
    if (tokenData) {
      const parsedUserData: UserData = JSON.parse(tokenData);
      setUserData(parsedUserData);
    }

    fetchProductData(props.productId)
      .then(data => {
        setProduct(data);
        if (data) {
          fetchStoreDetails(data.sellerEmail);
          fetchReviews(props.productId); // Fetch reviews for the product using productId
        }
      })
      .catch(error => {
        console.error('Error fetching product:', error);
      });
  }, [props.productId]);

  useEffect(() => {
    // Fetch reviews data
    fetchReviews(props.productId);
  }, [props.productId, refreshFlag]); // Include refreshFlag in dependencies



  const fetchReviews = async (productId: string) => {
    try {
      const feedback = await getFeedBackById(productId);
      setReviews(feedback);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };


  const getProductPhoto = async (imageUrl: string): Promise<string> => {
    try {
      const imageData = await getProductImage(imageUrl);
      const blob = new Blob([imageData], { type: "image/jpeg" });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error fetching product image:", error);
      return '';
    }
  };

  const fetchProductData = async (productId: string): Promise<Product | null> => {
    try {
      const productData = await getProductsByProductId(productId);
      const image =
        productData.productImages.length > 0
          ? await getProductPhoto(productData.productImages[0].productImageUrl)
          : '';
      const availability =
        productData.variations?.some((variation: { sizeQuantities: any[] }) =>
          variation.sizeQuantities.some(sizeQty => sizeQty.qty > 0)
        ) || false;
      const sizes: string[] =
        productData.variations?.reduce((acc: string[], variation: Variation) => {
          return [...acc, ...variation.sizeQuantities.map((sizeQty: SizeQuantity) => sizeQty.size)];
        }, [] as string[]) || [];

      return { ...productData, image, availability, sizes };
    } catch (error) {
      console.error("Error fetching product data:", error);
      return null;
    }
  };

  const fetchStoreDetails = async (sellerEmail: string) => {
    try {
      const storeData = await findStoreByEmail(sellerEmail);
      setStoreDetails(storeData);
    } catch (error) {
      console.error("Error fetching store details:", error);
    }
  };

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
  };

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(event.target.value));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      const filesArray: File[] = Array.from(fileList);
      setSelectedFiles(filesArray);
    }
  };

  const addToCartClicked = async () => {
    if (product && selectedColor && selectedSize && userData) {
      await addToCart({
        productId: props.productId,
        productPrice: product.price,
        userId: userData.username,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity
      })
        .then(async () => {
          const cartItems = await getCartsByUserId(userData.username);
          const cartCount = cartItems.length;
          console.log("Cart Count is...", cartCount)
          setCartCount(cartCount);
        })
        .catch(error => {
          console.error('Error adding to cart:', error);
        });
    }
  };

  const addToWishListClicked = async () => {
    setBump(true);
    if (product && selectedColor && selectedSize && userData) {
      await addToWishList({
        productId: props.productId,
        productPrice: product.price,
        userId: userData.username,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity
      })
        .then(async () => {
          // Handle wish list addition success
        })
        .catch(error => {
          console.error('Error adding to wish list:', error);
        });
    }
  };

  const handleReviewSubmit = async () => {
    try {
      if (!userData || !product) {
        console.error('User data or product data not available');
        return;
      }
      const feedback: Feedback = {
        userId: userData.username,
        productId: props.productId,
        comment: reviewText,
        rating: rating,
        uploadImageList: selectedFiles,
      };
      const response = await addToReviewFeedback(feedback, selectedFiles);
      console.log('Review submitted:', feedback.comment, 'Rating:', feedback.rating);
      setReviewText('');
      setRating(0);
      setRefreshFlag(prevFlag => !prevFlag); // Toggle refreshFlag
      return response;
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-container container">
      <div className="product-page row">
        <div className="image-container col-md-5">
          <ReactImageMagnify
            smallImage={{
              alt: product.name,
              src: product.image,
              width: 400,
              height: 400,
            }}
            largeImage={{
              src: product.image,
              width: 1200,
              height: 1800,
            }}
            enlargedImageContainerDimensions={{
              width: '200%',
              height: '200%',
            }}
            lensStyle={{
              position: 'absolute',
              width: '100px',
              height: '100px',
              border: '2px solid #333',
              pointerEvents: 'none',
              zIndex: 1,
            }}
            isHintEnabled={true}
          />
          <div className="magnifier" style={{ zIndex: 1 }} />
        </div>
        <div className="product-details col-md-4">
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p>
            Price: {
              product.discount === 0 ? (
                `${product.price} Rs.`
              ) : (
                <>
                  <span style={{ textDecoration: 'line-through' }}>{product.price} Rs.</span>{' '}
                  <strong style={{ color: 'red' }}>{product.newPrice} Rs.</strong>
                </>
              )
            }
          </p>
          <p>Availability: {product.availability ? 'In stock' : 'Out of stock'}</p>
          <div className="colors">
            {product.variations?.map((variation, index) => (
              <button
                key={index}
                className={`color ${selectedColor === variation.color ? 'selected' : ''}`}
                style={{ backgroundColor: variation.color }}
                onClick={() => handleColorClick(variation.color)}
              ></button>
            ))}
          </div>
          <div className="sizes">
            {selectedColor &&
              product.variations
                ?.find(variation => variation.color === selectedColor)
                ?.sizeQuantities.map((sizeQty, index) => (
                  <div
                    key={index}
                    className={`size ${selectedSize === sizeQty.size ? 'selected' : ''}`}
                    style={{
                      backgroundColor: selectedSize === sizeQty.size ? selectedColor : undefined,
                      color: selectedSize === sizeQty.size ? 'white' : 'black',
                    }}
                    onClick={() => handleSizeClick(sizeQty.size)}
                  >
                    {sizeQty.size} - {sizeQty.qty}
                  </div>
                ))}
          </div>
          <div>
            <label htmlFor="quantity" style={{ marginRight: '40px' }}>Quantity:</label>
            <input type="number" id="quantity" min="1" value={quantity} onChange={handleQuantityChange} style={{ width: '100px' }} />
            <div className="wishlist-icon" style={{ display: 'inline' }} onClick={addToWishListClicked}>
              <FontAwesomeIcon icon={faHeart} className={bump ? 'bump' : ''} data-tip="Add to Wishlist" />
            </div>
          </div>
          <button className='btn btn-primary' style={{ width: '400px' }} onClick={addToCartClicked}>Add to Cart</button>
          <button className='btn btn-danger mt-2' style={{ width: '400px' }}>Buy Now</button>
        </div>
        <div className="store-details col-md-2">
          {storeDetails && (
            <>
              <h3>Store Details</h3>
              <p><strong>Name:</strong> {storeDetails.name}</p>
              <p><strong>Contact No:</strong> {storeDetails.contactNo}</p>
              <p><strong>Address:</strong> {storeDetails.address}</p>
              <p><strong>Country:</strong> {storeDetails.country}</p>
            </>
          )}
        </div>
        <div className="review-section col-md-12">
          <Tabs>
            <TabList>
              <Tab>Reviews</Tab>
              <Tab>Specifications</Tab>
            </TabList>

            <TabPanel>
              <div className="review-form">
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review here..."
                ></textarea>
                <div className="rating-stars">
                  <Rating
                    count={5}
                    onChange={(rating: React.SetStateAction<number>) => setRating(rating)}
                    size={24}
                    activeColor="red"
                    isHalf={false}
                    value={rating}
                  />
                </div>
                <input type="file" multiple onChange={handleFileChange} />
                <button onClick={handleReviewSubmit}>Submit Review</button>
              </div>
              {reviews && (
                <div className="reviews-list" style={{ marginTop: '80px' }}>
                  <hr /> {/* Add a horizontal line */}
                  {reviews.map((review, index) => (
                    <div className="review" key={index}>

                      <p><strong>User:</strong> {review.userId}</p>
                      <p><strong>Comment:</strong> {review.comment}</p>
                      <p><strong>Rating:</strong> {review.rating}</p>

                      <div className="rating-stars">
                        <Rating
                          count={5}
                          value={review.rating}
                          size={24}
                          activeColor="red"
                          isHalf={false}
                          edit={false} // Set edit to false to make stars not clickable
                        />
                      </div>
                      <hr /> {/* Add a horizontal line to separate each feedback */}
                    </div>
                  ))}
                </div>
              )}

            </TabPanel>
            <TabPanel>
              <p>Specifications content goes here</p>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
