import React, { ChangeEvent, useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import "./SellerProductList.scss";
import { Tooltip } from "react-tooltip";
import {
  addNewItemFormInitialValues,
  addNewItemValidationSchema,
} from "../../utils/Validation";
import {
  addProduct,
  applyDiscount,
  deleteProduct,
  getProductImages,
  getProductsBySellerEmail,
  updateDiscount,
} from "../../services/apiService";
import { useNavigate } from "react-router-dom";
import SellerProductEdit from "./SellerProductEdit/SellerProductEdit";
import SellerProductSingleView from "./SellerProductSingleView/SellerProductSingleView";
import { Modal, Button } from "react-bootstrap";
import Inventory from "../Inventory/Inventory";

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

interface SizeQuantity {
  size: string;
  qty: string;
}

interface Variation {
  color: string;
  sizeQuantityDTOS: SizeQuantity[];
}

interface Product {
  style: string;
  productDescription: string;
  productCategory: string,
  productId: string;
  sellerEmail: string;
  name: string;
  material: string;
  price: number;
  category: string;
  discount: number;
  productImages: Array<{ productImageUrl: string }>;
  variations: Array<{
    color: string;
    sizeQuantities: Array<{
      size: string;
      qty: number;
    }>;
  }>;
}


const SellerProductList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFiles, setSelectedFilesNew] = useState<File[]>([]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [addNewItem, setAddNewItem] = useState(true);
  const [editProductStatus, setEditProductStatus] = useState(false);
  const [buttonName, setButtonName] = useState("Add New Item");
  const [productImg, setProductImg] = useState("");
  const [prodDiscount, setProdDiscount] = useState<number | null>(null);
  const [showAddDiscountModal, setShowAddDiscountModal] = useState(false);
  const [showUpdateDiscountModal, setShowUpdateDiscountModal] = useState(false);



  const [variation, setVariations] = useState<Variation[]>([
    {
      color: "",
      sizeQuantityDTOS: [{ size: "", qty: "" }],
    },
  ]);

  const handleAddVariation = () => {
    setVariations([...variation, { color: "", sizeQuantityDTOS: [{ size: "", qty: "" }] }]);
  };

  const [modalShow, setModalShow] = useState(false)
  const [products, setProducts] = useState<Product[]>([]);
  const [resolvedElements, setResolvedElements] = useState<JSX.Element[]>([]);

  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const handleClose = () => setShowInventoryModal(false);
  const handleShow = () => setShowInventoryModal(true);

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

  const fetchAndSetProductImages = async () => {
    setLoading(true);

    // Check if products is defined and not empty
    if (products && products.length > 0) {
      const productImagesPromises = products.map(async (product) => {
        // Check if productImages is defined
        if (product.productImages && product.productImages.length > 0) {
          const imageUrl = await fetchProductImages(product.productImages[0].productImageUrl);

          return (
            <tr key={product.productId}>
              {/* <td>{product.productId}</td> */}
              <td>
                {imageUrl ? (
                  <div className="profile-img" style={{ backgroundImage: `url(${imageUrl})` }}></div>
                ) : (
                  "No Image"
                )}
              </td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.productCategory}</td>
              <td>{product.style}</td>
              <td>${product.price}</td>

              <td>
                <i
                  className="bi bi-boxes actions-tab"
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Inventory"
                  data-tooltip-place="top"
                  onClick={() => viewInventory(product.productId)}

                ></i>
                <i
                  className="bi bi-eye-fill actions-tab"
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="View More"
                  data-tooltip-place="top"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => viewProduct(product.productId, product.discount)}
                ></i>
                <i
                  className="bi bi-pencil-square actions-tab"
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Edit"
                  data-tooltip-place="top"
                  onClick={() => editProduct(product.productId)}
                ></i>
                <i
                  className="bi bi-trash-fill"
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Delete"
                  data-tooltip-place="top"
                  onClick={() => deleteSellerProduct(product.productId)}
                ></i>
                <Tooltip id="my-tooltip" />
              </td>
            </tr>
          );
        } else {
          // Handle the case where product.productImages is undefined or empty
          return null;
        }
      });

      try {
        const resolvedElements = await Promise.all(productImagesPromises);

        // Filter out null values (products without images)
        const validElements = resolvedElements.filter((element) => element !== null);

        // Set state with type casting
        setResolvedElements(validElements as React.ReactElement[]);

      } catch (error) {
        // Handle error
        console.error("Error fetching product images:", error);
      } finally {
        setLoading(false);
      }
    }
    // If products is empty, you might want to handle this case or return early
  };

  useEffect(() => {
    getSellerProducts();
  }, []);

  useEffect(() => {
    fetchAndSetProductImages();
  }, [products]);

  const getSellerProducts = async () => {
    const email = sessionStorage.getItem("email");

    try {
      setLoading(true);
      const products = await getProductsBySellerEmail(email);
      setProducts(products);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // Handle error
    }
  };

  const handleToggle = () => {
    setAddNewItem((prev) => !prev);
    if (addNewItem) {
      setButtonName("View Product List");
    } else {
      setButtonName("Add New Item");
    }
  };

  const addProductFormSubmit = async (values: any, { resetForm }: any) => {
    try {
      const email = sessionStorage.getItem("email");
      const productDataForm = new FormData();

      if (email) {
        productDataForm.append("sellerEmail", email);
      }
      productDataForm.append("name", values.name);
      productDataForm.append("category", values.category.toLowerCase());
      productDataForm.append("material", values.material);
      productDataForm.append("productDescription", values.productDescription);
      productDataForm.append("price", values.price);
      productDataForm.append("variation", JSON.stringify(values.variation));
      productDataForm.append("productCategory", values.productCategory);
      productDataForm.append("style", values.style);

      /*

      if (selectedFile) {
        productDataForm.append(
          "productImages",
          selectedFile,
          selectedFile.name
        );
      }


      */

      // Append each selected file to the FormData object
      selectedFiles.forEach((file) => {
        productDataForm.append('productImages', file);
      });

      console.log("Product Description Chamara..", values.productDescription)
      const products = await addProduct(productDataForm);

      if (products) {
        setLoading(false);
        resetForm();
        resetForm({
          values: addNewItemFormInitialValues,
          errors: {},
          touched: {},
          isValidating: false,
          isSubmitting: false,
        });

        setVariations([
          {
            color: "",
            sizeQuantityDTOS: [{ size: "", qty: "" }],
          },
        ]);

        setSelectedFile(null);
      } else {
        setLoading(false);
      }
    } catch (error) { }
  };

  const handleAddColor = () => {
    setVariations([...variation, { color: "", sizeQuantityDTOS: [{ size: "", qty: "" }] }]);
  };

  const handleAddSizeQuantity = (index: number) => {
    const newVariations = [...variation];
    newVariations[index].sizeQuantityDTOS.push({ size: "", qty: "" });
    setVariations(newVariations);
  };
  const deleteSellerProduct = async (id: any) => {
    const prodDelete = await deleteProduct(id);
    getSellerProducts();
  };

  /*
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);

    if (file) {
      // Read the contents of the image file
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

  };

  */

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      const filesArray: File[] = Array.from(fileList);
      setSelectedFilesNew(filesArray);
    }
  };

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const editProduct = (productId: string | null = null) => {
    setSelectedProductId(productId);
    setEditProductStatus((prev) => !prev);
  };

  const viewProduct = (productId: string, discount: number) => {
    setSelectedProductId(productId);
    modalView();
    setProdDiscount(discount);
    console.log(productId);
    console.log('Heloooooo', prodDiscount)

  };
  const viewInventory = (productId: string) => {
    setSelectedProductId(productId);
    console.log(productId);
    handleShow();

  };
  const modalView = () => {
    setModalShow((prev) => !prev)
  }

  
  const handleAddDiscount = () => {
    setShowAddDiscountModal(true);
  };

  const handleUpdateDiscount = () => {
    setShowUpdateDiscountModal(true);
  };

  const handleAddDiscountAPI = async () => {
    // Retrieve the new discount value from the input box
    const addDiscountInput = document.getElementById('addDiscountInput') as HTMLInputElement;
    if (addDiscountInput) {
      const newDiscount = addDiscountInput.value;
      await applyDiscount(selectedProductId, newDiscount);
      console.log("New Discount..",newDiscount)


    }

  }

    const handleUpdateDiscountAPI = async () => {
      // Retrieve the new discount value from the input box
      const updateDiscountInput = document.getElementById('updateDiscountInput') as HTMLInputElement;
      if (updateDiscountInput) {
        const newDiscount = updateDiscountInput.value;
        await updateDiscount(selectedProductId, newDiscount);
         //setProdDiscount(newDiscount);
        console.log("New Discount..",newDiscount)
  
      }

    }

    const handleupdateCloseModal = () => {
      setShowUpdateDiscountModal(false);
      window.location.reload();
    };

    const handleaddCloseModal = () => {
      setShowAddDiscountModal(false);
      window.location.reload();
    };

  return (
    <div className="seller-product-list">
      <div className="container">
        {editProductStatus ? (
          <div><SellerProductEdit productId={selectedProductId} onClose={editProduct} /> </div>
        ) : (
          <div>
            <p className="addNewProdBtn" onClick={handleToggle}>
              {buttonName}
            </p>
            <br />
            {addNewItem ? (
              <div>
                <table className="table table-striped item-table">
                  <thead className="thead-light">
                    <tr>
                      {/* <th scope="col">#</th> */}
                      <th scope="col">Image</th>
                      <th scope="col">Name</th>
                      <th scope="col">Category</th>
                      <th scope="col">Product Category</th>
                      <th scope="col">Style</th>
                      <th scope="col">Price</th>
                      <th scope="col">Action</th>
                      {/* Add other columns as needed */}
                    </tr>
                  </thead>
                  <tbody>{resolvedElements}</tbody>
                </table>
              </div>
            ) : (
              <div>
                {" "}
                <div className="new-item-form">
                  <Formik
                    initialValues={addNewItemFormInitialValues}
                    validationSchema={addNewItemValidationSchema}
                    onSubmit={addProductFormSubmit}
                  >
                    {({ values, handleChange, handleBlur, touched, errors }) => (
                      <Form>
                        <div className="field-container">
                          <div className="field-input">
                            <label>Product Name :</label>
                            <Field
                              type="text"
                              id="name"
                              name="name"
                            />
                          </div>

                          <ErrorMessage
                            name="name"
                            component="div"
                            className="error"
                          />
                        </div>
                        <div className="field-container">
                          <div className="field-input">
                            <label>Category :</label>
                            <Field type="text" id="category" name="category" />
                          </div>
                          <ErrorMessage
                            name="category"
                            component="div"
                            className="error"
                          />
                        </div>
                        <div className="field-container">
                          <div className="field-input">
                            <label>Material :</label>
                            <Field type="text" id="material" name="material" />
                          </div>
                          <ErrorMessage
                            name="material"
                            component="div"
                            className="error"
                          />
                        </div>

                        <div className="field-container">
                          <div className="field-input">
                            <label>Product Description :</label>
                            <Field type="text" id="productDescription" name="productDescription" />
                          </div>

                        </div>

                        <div className="field-container">
                          <div className="field-input">
                            <label>Product Category :</label>
                            <Field type="text" id="productCategory" name="productCategory" />
                          </div>

                        </div>

                        <div className="field-container">
                          <div className="field-input">
                            <label>Style :</label>
                            <Field type="text" id="style" name="style" />
                          </div>

                        </div>


                        <div className="field-container">
                          <div className="field-input">
                            <label>Price :</label>
                            <Field type="number" id="price" name="price" />
                          </div>
                          <ErrorMessage
                            name="price"
                            component="div"
                            className="error"
                          />
                        </div>

                        <div className="field-container">
                          <div className="file-input-container">
                            <label className="file-label">Images :</label>
                            <div className="name">
                              <label
                                htmlFor="fileInput"
                                className="file-input-label"
                              >
                                <span className="button">Choose Image</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  id="fileInput"
                                  className="file-input"
                                  onChange={handleFileChange}
                                  multiple // Allow multiple files to be selected
                                />
                              </label>
                              <div className="fileName">
                                {selectedFile && (
                                  <div>
                                    <span className="file-name">
                                      {selectedFile.name}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr />
                        <div className="variation-header">
                          <p>Variations</p>
                          {variation.map((v, index) => (
                            <div key={index} className="form-container">
                              <div className="buttons">
                                <button
                                  className="btn btn-success addNew-success-button"
                                  onClick={() => handleAddSizeQuantity(index)}
                                  type="button"
                                >
                                  +
                                </button>
                              </div>

                              <div key={index} className="field-container">
                                <div className="field-input">
                                  <Field
                                    type="text"
                                    name={`variation[${index}].color`}
                                    placeholder="Color"
                                  />
                                </div>
                                {v.sizeQuantityDTOS.map((sq, sqIndex) => (
                                  <div key={sqIndex} className="field-input">
                                    <Field
                                      type="text"
                                      name={`variation[${index}].sizeQuantityDTOS[${sqIndex}].size`}
                                      placeholder="Size"

                                    />
                                    <Field
                                      type="text"
                                      name={`variation[${index}].sizeQuantityDTOS[${sqIndex}].qty`}
                                      placeholder="Quantity"

                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          <div className="buttons">
                            <button
                              className="btn btn-info addNew-danger-button"
                              onClick={handleAddColor}
                              type="button"
                            >
                              + Add Variation
                            </button>
                          </div>
                        </div>
                        <div className="field-container">
                          <div className="buttons">
                            <button className="btn btn-secondary" onClick={handleToggle} >Cancel</button>
                            <button
                              className="btn btn-success"
                              type="submit"
                              disabled={loading}

                            >
                              {" "}
                              {loading ? (
                                <div className="loader">
                                  <span>Loading...</span>
                                  <div className="spinner" />
                                </div>
                              ) : (
                                "Submit"
                              )}
                            </button>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      <div className="modal fade" id="exampleModal" data-bs-backdrop="static" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              {modalShow && <SellerProductSingleView productId={selectedProductId} />}
            </div>
            <div className="modal-footer">
              {/* <p>{prodDiscount}</p> */}
              <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => modalView()}>Close</button>
              {/* <button type="button" className="btn btn-primary">Save Changes</button> */}
              {prodDiscount === 0 ? (
                <button type="button" className="btn btn-primary" onClick={ handleAddDiscount}>Add Discount </button>
              ) : (
                <button type="button" className="btn btn-secondary" onClick = {handleUpdateDiscount}>Update Discount </button>
              )}
            </div>
          </div>
        </div>
      </div>

      

{/* Add Discount Modal */}
<Modal
  show={showAddDiscountModal}
  onHide={() => setShowAddDiscountModal(false)}
>
  <Modal.Header closeButton>
    <Modal.Title>Add Discount</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <p style={{ fontSize: '16px' }}>Current Discount: {prodDiscount !== null ? prodDiscount * 100 : 0} % </p>
    <div className="form-group">
      <label htmlFor="addDiscountInput">New Discount:</label>
      <input
        type="text"
        className="form-control"
        id="addDiscountInput"
        placeholder="Enter discount"
        // Add onChange handler if you need to handle input changes
        // onChange={handleAddDiscountInputChange}
      />
    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => handleaddCloseModal()}>
      Close
    </Button>
    <Button variant="primary" onClick={handleAddDiscountAPI}>
      Add
    </Button>
  </Modal.Footer>
</Modal>

{/* Update Discount Modal */}
<Modal
  show={showUpdateDiscountModal}
  onHide={() => setShowUpdateDiscountModal(false)}
>
  <Modal.Header closeButton>
    <Modal.Title>Update Discount</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <p style={{ fontSize: '16px' }}> Current Discount: {prodDiscount !== null ? prodDiscount * 100 : 0} % </p>
    <div className="form-group">
      <label htmlFor="updateDiscountInput">New Discount:</label>
      <input
        type="text"
        className="form-control"
        id="updateDiscountInput"
        placeholder="Enter new discount"
        // Add onChange handler if you need to handle input changes
        // onChange={handleUpdateDiscountInputChange}
      />
    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => handleupdateCloseModal()}>
      Close
    </Button>
    <Button variant="primary" onClick={handleUpdateDiscountAPI}>
      Update
    </Button>
  </Modal.Footer>
</Modal>


      <Modal show={showInventoryModal} onHide={handleClose} backdrop="static" keyboard={false} size="lg"
        centered
      >
        <Modal.Header closeButton>
          Inventory Management
        </Modal.Header>
        <Modal.Body>
          <Inventory productId={selectedProductId} onClose={handleClose} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SellerProductList;
