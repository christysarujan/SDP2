import React, { useState, useEffect } from 'react';
import './ProductPage.scss';
import { getProductsByProductId, getProductImage, findStoreByEmail, addToCart, getCartsByUserId } from '../../../services/apiService';
import ReactImageMagnify from 'react-image-magnify'; // Import React Image Magnify
import { useCart } from '../../Cart/CartContext';

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
  discount: number; // New property for discount
  newPrice: string; // New property for discounted price
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

function ProductPage(props: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [storeDetails, setStoreDetails] = useState<any | null>(null); // Adjust the type as per your actual implementation
  const [userData, setUserData] = useState<UserData | null>(null);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  const { setCartCount } = useCart();

  useEffect(() => {
    // Retrieve user data from session storage
    const tokenData = sessionStorage.getItem("decodedToken");
    if (tokenData) {
      const parsedUserData: UserData = JSON.parse(tokenData);
      console.log("user Data...", parsedUserData);
      setUserData(parsedUserData);
    }

    // Fetch product data
    fetchProductData(props.productId)
      .then(data => {
        setProduct(data);
        // Fetch Store Details
        if (data) {
          fetchStoreDetails(data.sellerEmail);
        }
      })
      .catch(error => {
        console.error('Error fetching product:', error);
      });
  }, [props.productId]);

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
      console.log("Store Data is ", storeData)
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

  const addToCartClicked = async () => {
    if (product && selectedColor && selectedSize && userData) {
      console.log("Adding to cart:", {
        productId: props.productId,
        productPrice: product.price,
        username: userData.username,
        selectedColor: selectedColor,
        selectedSize: selectedSize,
        quantity: quantity
      });

      // Call addToCart API function
      await addToCart({
        productId: props.productId,
        productPrice: product.price,
        userId: userData.username,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity
      })
      .then(async () => {
        // Fetch cart items by user ID
        const cartItems = await getCartsByUserId(userData.username);
        // Calculate the total cart count
        const cartCount = cartItems.reduce((total: any, item: { quantity: any; }) => total + item.quantity, 0);
      

         // Update the cart count in the context
         setCartCount(cartCount);
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
        // Handle error, maybe show an error message to the user
      });
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-container container">
      <div className="product-page row">
        <div className="image-container col-md-5">
          <ReactImageMagnify {...{
            smallImage: {
              alt: product.name,
              src: product.image,
              width: 400, // Specify the width of the small image
              height: 400, // Specify the height of the small image
            },
            largeImage: {
              src: product.image,
              width: 1200, // Width of the large image
              height: 1800, // Height of the large image
            },
            enlargedImageContainerDimensions: {
              width: '200%', // Adjust the width of the enlarged image container
              height: '200%', // Adjust the height of the enlarged image container
            },
            lensStyle: {
              position: 'absolute',
              width: '100px', // Adjust width and height to make it square
              height: '100px', // Adjust width and height to make it square
              border: '2px solid #333',
              pointerEvents: 'none', // Ensure the magnifier doesn't interfere with mouse events on the image
            },
            isHintEnabled: true,
          }} />
          <div className="magnifier" style={{ left: `${magnifierPos.x}%`, top: `${magnifierPos.y}%` }} />
        </div>
        <div className="product-details col-md-5">
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
          <p>Brand: {product.brand}</p>
          <p>Availability: {product.availability ? 'In stock' : 'Out of stock'}</p>
          {/* Add your remaining code here */}
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
      </div>
    </div>
  );
}

export default ProductPage;
