import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import "./storeRequests.scss";
import {  unpublishProduct,getAllProducts,productAccountStateChange} from "../../services/apiService";
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
  const [productList, setProductList] = useState<ProductInfo[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmPublishModalOpen, setConfirmPublishModalOpen] = useState(false);
  const [unpublishModalOpen, setUnpublishModalOpen] = useState(false);
  const [unpublishReason, setUnpublishReason, ] = useState('');
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
 
  
// Fetch product list on component mount
  useEffect(() => {
    getAllProductList();
  }, []);

    // Function to fetch all products
  const getAllProductList = async () => {
    try {
      const response = await getAllProducts();
      setProductList(response);
    } catch (error) {
      console.error("Error:", error);
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
        <table className="table table-hover product-data-table">
          <thead>
            <tr>
              <th className="col-md-1">#</th>
              <th className="col-md-4">Product Name</th>
              <th className="col-md-3">Material</th>
              <th className="col-md-2">Status</th>
              <th className="col-md-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((product: ProductInfo, index: number) => (
              <tr key={product.productId}>
                <td className="col-md-1">{index + 1}</td>
                <td className="col-md-4">{product.name}</td>
                <td className="col-md-3">{product.material}</td>
                <td className="col-md-2">{product.productStatus}</td>
                <td className="col-md-2">
                  <button
                    className="btn btn-primary view-info-btn"
                    onClick={() => openModal(product)}
                  >
                    View Info
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Data Available</p>
      )}

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
