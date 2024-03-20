import React, { useState, useEffect } from 'react';
import './ProductPage.scss';
import { getProductsByProductId, getProductImage, findStoreByEmail, addToCart, getCartsByUserId, addToWishList, addToReviewFeedback, getFeedBackById, getFeedBackImage, calculateCost, getCartById, getcostById, addOrder, calculateCostByOrderIdandProductId, getOrderById } from '../../../services/apiService';
import ReactImageMagnify from 'react-image-magnify';
import { useCart } from '../../Cart/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'; // Import arrow icons
import Rating from 'react-rating-stars-component';
import 'react-tabs/style/react-tabs.scss';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

interface Product {
  productDescription: string;
  name: string;
  images: string[]; // Modify to store all images
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
  feedbckimages?: string[]; // Add feedbckimages property
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
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0); 
  const [finalTotal, setFinalTotal] = useState<number >(0);
  // Add state for current image index

  const navigate = useNavigate();

  useEffect(() => {
    const tokenData = sessionStorage.getItem("decodedToken");
    if (tokenData) {
      const parsedUserData = JSON.parse(tokenData);
      setUserData(parsedUserData);
    }

    fetchProductData(props.productId)
      .then(data => {
        setProduct(data);
        if (data) {
          fetchStoreDetails(data.sellerEmail)
            .then(storeData => {
              // Assuming fetchStoreDetails returns store data
              // Update store details state here
            })
            .catch(error => {
              console.error('Error fetching store details:', error);
            });

          fetchReviews(props.productId)
            .then(reviewData => {
              setReviews(reviewData);
            })
            .catch(error => {
              console.error('Error fetching reviews:', error);
            });
        }
      })
      .catch(error => {
        console.error('Error fetching product:', error);
      });
  }, [props.productId]);


  useEffect(() => {
    // Fetch reviews data
    fetchReviews(props.productId)
      .then(data => {
        setReviews(data);

      });
  }, [props.productId, refreshFlag]); // Include refreshFlag in dependencies


  const fetchReviews = async (productId: string) => {
    try {
      const feedback = await getFeedBackById(productId);
      const feedbckimages = await Promise.all(feedback.map(async (review: Feedback) => {
        const images = await Promise.all(review.uploadImageList?.map((image: any) => getFeedBackPhoto(image.productImageUrl)) || []);
        return images;
      }));

      const reviewsWithImages = feedback.map((review: Feedback, index: number) => ({
        ...review,
        feedbckimages: feedbckimages[index],
      }));

      setReviews(reviewsWithImages);
      return reviewsWithImages; // Return the reviews data
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Set reviews state to an empty array
      setReviews([]);
      return []; // Return an empty array in case of error
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

  const getFeedBackPhoto = async (imageUrl: string): Promise<string> => {
    try {
      const imageData = await getFeedBackImage(imageUrl);
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
      const images = await Promise.all(productData.productImages.map((image: any) => getProductPhoto(image.productImageUrl)));
      const availability =
        productData.variations?.some((variation: { sizeQuantities: any[] }) =>
          variation.sizeQuantities.some(sizeQty => sizeQty.qty > 0)
        ) || false;
      const sizes: string[] =
        productData.variations?.reduce((acc: string[], variation: Variation) => {
          return [...acc, ...variation.sizeQuantities.map((sizeQty: SizeQuantity) => sizeQty.size)];
        }, [] as string[]) || [];

      return { ...productData, images, availability, sizes };
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

    if (!selectedColor) {
     // alert('Please select a size.');
      toast.error('Please select a color.');
      return;
    }
  
    if (!selectedSize) {
      //alert('Please select a size.');
      toast.error('Please select a size.');
      return;
    }

    if (product && selectedColor && selectedSize && userData) {
      const userId = sessionStorage.getItem("userId");
      if (userId !== null) {
        try {
          const cartresponse = await addToCart({
            productId: props.productId,
            productPrice: product.price,
            userId: userId, 
            color: selectedColor,
            size: selectedSize,
            quantity: quantity
          });

          console.log('Response from backend Id:', cartresponse); // Log the response here
          const cartItems = await getCartsByUserId(userId);
          const cartCount = cartItems.length;
          console.log("Cart Count is...", cartCount)
          setCartCount(cartCount);

          const calresponse = await calculateCost({

            productId: props.productId,
            cartId: cartresponse.id

          })

          var cartwithcost = await getCartById(cartresponse.id);

          const startTime = new Date().getTime(); // Get current time in milliseconds

          while (cartwithcost.costId === null) {

            console.log("Iterating and Checking Cost Id Update.....");

            cartwithcost = await getCartById(cartresponse.id);

            if (cartwithcost.costId !== null) {
              break;
            }

            const currentTime = new Date().getTime(); // Get current time in milliseconds
            const elapsedTime = currentTime - startTime; // Calculate elapsed time

            // Break the loop if 10 seconds (10000 milliseconds) has passed
            if (elapsedTime >= 10000) {

              console.log("=== Time limit exceeded. Exiting loop ===");
              console.log("=== Cost Id not updated in Cart DB ===");
              console.log("=== Please Check Kafka Server ===");
              console.log("=== Try To Clean logs and Try to Restart Kafka Server  ===");
              break;
            }

            // Add a delay before next iteration to avoid excessive API calls
            await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust delay as needed
          }

          if (cartwithcost.costId !== null) {

            const costDetails = await getcostById(cartwithcost.costId);

            //console.log("Costing Cart..", cartwithcost);

            console.log("Costing Details..", costDetails);

          }

        } catch (error) {
          console.error('Error adding to cart:', error);
        }
      } else {
        console.error('User ID not found in session storage');
      }
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

  var newFinalTotal : any;


  const orderDetails = {
    productId: props.productId || null,
    productName : product?.name || null,
    productPrice: product?.newPrice || product?.price || null,
    color: selectedColor || null,
    size: selectedSize || null,
    quantity: quantity || null,
    images: product?.images.map(image => image) || [], // Storing image URLs
   
  };
  
  
  
  const buynowclick = async () => {

    console.log('Order Details:', orderDetails);
  
    if (!selectedColor) {
      toast.error('Please select a color.');
      return;
    }
   
    if (!selectedSize) {
      toast.error('Please select a size.');
      return;
    }
  
    console.log("Product ID..", props.productId);
  
    try {
      const receivedOrderObject = await addOrder({
        productId: props.productId,
        userId: sessionStorage.getItem("userId") || null,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity
      });
  
      console.log("Received Order Object:", receivedOrderObject);

      var deliveryCharge = receivedOrderObject.deliveryChargeAmount;
  
      await calculateCostByOrderIdandProductId({
        productId: props.productId,
        orderId: receivedOrderObject.id
      });
  
      let updatedOrderObject = await getOrderById(receivedOrderObject.id);
  
      const startTime = new Date().getTime(); // Get current time in milliseconds
  
      while (updatedOrderObject.costId === null) {
        console.log("Iterating and Checking Cost Id Update.....");
  
        updatedOrderObject = await getOrderById(receivedOrderObject.id);
  
        if (updatedOrderObject.costId !== null) {
          break;
        }
  
        const currentTime = new Date().getTime(); // Get current time in milliseconds
        const elapsedTime = currentTime - startTime; // Calculate elapsed time
  
        if (elapsedTime >= 10000) {
          console.log("=== Time limit exceeded. Exiting loop ===");
          console.log("=== Cost Id not updated in Cart DB ===");
          console.log("=== Please Check Kafka Server ===");
          console.log("=== Try To Clean logs and Try to Restart Kafka Server  ===");
          break;
        }
  
        await new Promise(resolve => setTimeout(resolve, 1000)); // Add a delay before next iteration
      }
  
      if (updatedOrderObject.costId !== null) {
        let costDetails = await getcostById(updatedOrderObject.costId);
        console.log("Costing Details..", costDetails);
      
        // Assign costDetails.finalTotal to newFinalTotal
        newFinalTotal = costDetails.finalTotal;
      
      
      }
      
  
      navigate(`/orderproduct/${props.productId}`, {
        state: { orderDetails , newFinalTotal , deliveryCharge }
      });
  
    } catch (error) {
      console.error('Error adding order:', error);
    }
  }
  


  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-container container">
      <div className="product-page row">
        <div className="image-container col-md-5">
          <div className="main-image">
            <ReactImageMagnify
              smallImage={{
                alt: product?.name || "",
                src: product?.images[currentImageIndex] || "",
                width: 400,
                height: 400,
              }}
              largeImage={{
                src: product?.images[currentImageIndex] || "",
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
          <div className="thumbnail-container">
            {product?.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index}`}
                className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
          <div className="navigation-arrows">
            <FontAwesomeIcon icon={faArrowLeft} onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? product.images.length - 1 : prevIndex - 1))} />
            <FontAwesomeIcon icon={faArrowRight} onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex === product.images.length - 1 ? 0 : prevIndex + 1))} />
          </div>
        </div>
        <div className="product-details col-md-4">
          {/* Product details */}

          <h1>{product.name}</h1>

          <p>
            Price: {
              product.discount === 0 ? (
                `${product.price} Rs.`
              ) : (
                <>
                  <span style={{ textDecoration: 'line-through' }}>{product.price} Rs.</span>{' '}
                  
                  <span style={{ color: 'green' }}>({((product.discount * 100).toFixed(0))}% off)</span>{' '}

                  <strong style={{ color: 'red' }}>{product.newPrice} Rs.</strong>{' '}

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
          <button className='btn btn-danger mt-2' style={{ width: '400px' }} onClick={buynowclick}> Buy Now

          </button>
          {/* Color, size, quantity selectors */}
          {/* Add to cart button */}
          {/* Add to wishlist button */}
        </div>
        <div className="store-details col-md-2">
          {/* Store details */}
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
          {/* Review section */}
          <Tabs>
            <TabList>
              <Tab>Reviews</Tab>
              <Tab>Description</Tab>
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

                      {review.feedbckimages && review.feedbckimages.map((image, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={image}
                          alt={`Review Image ${imgIndex}`}
                          style={{
                            width: '100px',  // Set a fixed width
                            height: '100px', // Set a fixed height
                            objectFit: 'cover', // Maintain aspect ratio and cover the entire space
                            marginRight: '10px', // Add margin-right to create space between images
                            marginBottom: '10px' // Add margin-bottom to create space between rows of images
                          }}
                        />
                      ))}


                      <hr /> {/* Add a horizontal line to separate each feedback */}
                    </div>
                  ))}
                </div>
              )}
            </TabPanel>
            <TabPanel>
              <p>{product.productDescription}</p>
            </TabPanel>
          </Tabs>
        </div>

      </div>
    </div>
  );
}

export default ProductPage;


