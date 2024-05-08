import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "./storeRequests.scss";
import {  unpublishProduct,getAllProducts,productAccountStateChange, getProductImages, getProductsByAdminEmail} from "../../services/apiService";
import { Modal, Button,Form  } from "react-bootstrap";
 
interface UserData {
  sub: string;
  role: string;
  productStatus: string;
  iss: string;
  exp: number;
  iat: number;
  email: string;
  username: string;
}
 
interface ProductInfo {
  productId: string;
  name: string;
  sellerEmail: string;
  material: string;
  price: number;
  category: string;
  productImages: { productImageUrl: string }[];
  variations: { color: string; sizeQuantities: { size: string; qty: number }[] }[];
  productStatus: string;
  discount: number;
  newPrice:number;
}
 
const ProductManagement = () => {
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState<ProductInfo[]>([]);
  const [resolvedElements, setResolvedElements] = useState<JSX.Element[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmPublishModalOpen, setConfirmPublishModalOpen] = useState(false);
  const [unpublishModalOpen, setUnpublishModalOpen] = useState(false);
  const [unpublishReason, setUnpublishReason, ] = useState('');
  const [reasonModalOpen, setReasonModalOpen] = useState(false);

  //pagination start

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of reviews per page
 
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
 
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = productList.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(productList.length / itemsPerPage);

  //paginate end

  const fetchProductImages = async (productName: string): Promise<string | null> => {
    try {
      const imageData = await getProductImages(productName);
      const blob = new Blob([imageData], { type: "image/png" });
      const imageUrl = URL.createObjectURL(blob);
      return imageUrl;
    } catch (error) {
      console.error("Error fetching product image:", error);
      return null;
    }
  };

  // const fetchAndSetProductImages = async () => {
  //   setLoading(true);

  //   // Check if products is defined and not empty
  //   if (productList && productList.length > 0) {
  //     const productImagesPromises = currentProducts.map(async (ProductInfo) => {
  //       // Check if productImages is defined
  //       if (ProductInfo.productImages && ProductInfo.productImages.length > 0) {
  //         const imageUrl = await fetchProductImages(ProductInfo.productImages[0].productImageUrl);

  //         return (
  //           <tr key={ProductInfo.productId}>
  //             {/* <td>{product.productId}</td> */}
  //             <td>
  //               {imageUrl ? (
  //                 <div className="profile-img" style={{ backgroundImage: `url(${imageUrl})` }}></div>
  //               ) : (
  //                 "No Image"
  //               )}
  //             </td>
  //             <td>{ProductInfo.name}</td>
  //             <td>{ProductInfo.material}</td>
  //             <td>{ProductInfo.productStatus}</td>
  //             {/* <td>{ProductInfo.}</td> */}
  //             <td className="col-md-2">
  //                 <button
  //                   className="btn btn-primary btn-sm view-info-btn"
  //                   onClick={() => openModal(ProductInfo)}
  //                 >
  //                   View Info
  //                 </button>
  //             </td>

  //           </tr>
  //         );
  //       } else {
  //         // Handle the case where product.productImages is undefined or empty
  //         return null;
  //       }
  //     });

  //     try {
  //       const resolvedElements = await Promise.all(productImagesPromises);

  //       // Filter out null values (products without images)
  //       const validElements = resolvedElements.filter((element) => element !== null);

  //       // Set state with type casting
  //       setResolvedElements(validElements as React.ReactElement[]);

  //     } catch (error) {
  //       // Handle error
  //       console.error("Error fetching product images:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   // If products is empty, you might want to handle this case or return early
  // };
 
  const fetchAndSetProductImages = async () => {
    setLoading(true);
  
    if (currentProducts && currentProducts.length > 0) {
      const productImagesPromises = currentProducts.map(async (product) => {
        if (product.productImages && product.productImages.length > 0) {
          const imageUrl = await fetchProductImages(product.productImages[0].productImageUrl);
  
          return (
            <tr key={product.productId}>
              <td>
                {imageUrl ? (
                  <div className="profile-img" style={{ backgroundImage: `url(${imageUrl})` }}></div>
                ) : (
                  "No Image"
                )}
              </td>
              <td>{product.name}</td>
              <td>{product.material}</td>
              <td>{product.productStatus}</td>
              <td className="col-md-2">
                <button
                  className="btn btn-primary btn-sm view-info-btn"
                  onClick={() => openModal(product)}
                >
                  View Info
                </button>
              </td>
            </tr>
          );
        } else {
          return null;
        }
      });
  
      try {
        const resolvedElements = await Promise.all(productImagesPromises);
        const validElements = resolvedElements.filter((element) => element !== null);
        setResolvedElements(validElements as React.ReactElement[]);
      } catch (error) {
        console.error("Error fetching product images:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  
 
// Fetch product list on component mount
  useEffect(() => {
    getAdminProducts();
  }, []);

  // useEffect(() => {
  //   fetchAndSetProductImages();
  // }, [productList]);

  useEffect(() => {
    fetchAndSetProductImages();
  }, [productList,currentPage]);
 
    // Function to fetch all products
  const getAllProductList = async () => {
    try {
      const response = await getAllProducts();
      setProductList(response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getAdminProducts = async () => {
    try {
      setLoading(true); // Assuming you have loading state
      const products = await getProductsByAdminEmail();
      setProductList(products); // Set the state with fetched products
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching products:", error);
    }
  };
 
  const handleUnpublishClick = () => {
    setReasonModalOpen(true);
  };
 
  const handleReasonModalClose = () => {
    setReasonModalOpen(false);
    setUnpublishReason("");
  };
 
  const handleUnpublishCancel = () => {
    setUnpublishModalOpen(false);
  };
 
  const openModal = (product: ProductInfo) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };
 
  const handleCloseConfirmPublishModal = () => {
    setConfirmPublishModalOpen(false);
    setUnpublishReason("");
  };
 
  const handleClose = () => {
    setModalOpen(false); // Close the Product Information Modal
    setConfirmPublishModalOpen(false);
    setUnpublishReason("");
  };
 
  const handleUnpublish = async () => {
   //setConfirmPublishModalOpen(true);
    try {
      if (selectedProduct) {
       // setConfirmPublishModalOpen(true);
        await unpublishProduct(selectedProduct.productId, unpublishReason);
         
        console.log("unpublish",selectedProduct.productId, unpublishReason);
        setConfirmPublishModalOpen(false);
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
 
  const handleConfirmUnpublish = async () => {
    try {
      if (selectedProduct) {
        await unpublishProduct(selectedProduct.productId, unpublishReason);
 
        // Close the modals and update the product list
        handleClose();
        getAllProductList();
 
        // Provide a success message to the user
        alert("Product unpublished successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // Reset the unpublish reason and close the confirmation modal
      setUnpublishReason("");
      setConfirmPublishModalOpen(false);
    }
  };
 
return (
  <div className="product-details">
    <div className="container">
     {productList ? (
        <table className="table table-striped product-data-table">
          <thead className="thead-light">
            <tr>
              <th className="col-md-1" >Image</th>
              <th className="col-md-3">Product Name</th>
              <th className="col-md-3">Material</th>
              <th className="col-md-2">Status</th>
              <th className="col-md-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resolvedElements}
          </tbody>
        </table>
      ) : (
        <p>No Data Available</p>
      )}

      {/*pagination */}

      <div className="pagination justify-content-center">
          {/* Previous page button */}
          <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`page-link ${currentPage === 1 ? 'active' : ''}`} // Add active class for first page
            >
              Previous
          </button>
          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              disabled={currentPage === index + 1}
              className={`page-link ${currentPage === index + 1 ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
          {/* Next page button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`page-link ${currentPage === totalPages ? 'active' : ''}`}
          >
            Next
          </button>
        </div>

      <Modal
        show={modalOpen}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="sm"
        centered
      >
        <Modal.Header closeButton>Product Information </Modal.Header>
        <Modal.Body>
 
        <Modal
        show={confirmPublishModalOpen}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="sm"
        centered
      >
 
        <Modal.Body>
 
            {/* Input field for unpublish reason */}
            <Form.Group controlId="unpublishReason">
                  <Form.Label>Unpublish Reason:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter reason for unpublishing"
                    value={unpublishReason}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setUnpublishReason(e.target.value)}
                  />
                </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="form-submit-btn"
            variant="secondary"
            onClick={handleCloseConfirmPublishModal}
          >
            Close
          </Button>
          <Button
            className="form-submit-btn"
            variant="danger"
            onClick={handleUnpublish}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
 
          {selectedProduct && (
            <>
              <p><b>Product Name:</b> {selectedProduct.name}</p>
              <p><b>Seller Email:</b> {selectedProduct.sellerEmail}</p>
              <p><b>Material:</b> {selectedProduct.material}</p>
              <p><b>Price:</b> {selectedProduct.price}</p>
              <p><b>Category:</b> {selectedProduct.category}</p>
              <p><b>Discount:</b> {selectedProduct.discount}</p>
              <p><b>NewPrice:</b> {selectedProduct.newPrice}</p>
              <p><b>Status:</b> {selectedProduct.productStatus}</p>
            </>
          )}
 
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="form-submit-btn"
            variant="secondary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            className="form-submit-btn"
            variant="danger"
            onClick={() => setConfirmPublishModalOpen(true)}
          >
            Unpublish
          </Button>
        </Modal.Footer>
      </Modal>  
     
    </div>
  </div>
);
  };
 
export default ProductManagement;