import React from 'react';
import { useParams } from 'react-router-dom';
import ProductPage from './viewProduct'; // Import the ProductPage component

interface RouteParams {
  productId?: string;
 // sellerEmail?: string;
}

const ProductPageRoute: React.FC = () => {
  const { productId, sellerEmail } = useParams<any>();

  // Check if productId and sellerEmail are defined before rendering ProductPage
  if (!productId ) {
    // Handle the case where route parameters are not provided
    return <div>No product found</div>;
  }

  return <ProductPage productId={productId}  />;
};

export default ProductPageRoute;
