import React, { ChangeEvent, useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {
  loginInitialValues,
  loginValidationSchema,
} from "../../utils/Validation";
import "./SellerProductList.scss";
import { Tooltip } from "react-tooltip";
import {
  addNewItemFormInitialValues,
  addNewItemValidationSchema,
} from "../../utils/Validation";
import { findUserByEmail } from "../../services/apiService";

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

const SellerProductList = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [variations, setVariations] = useState([
    { color: "", size: "", quantity: "" },
  ]);
  const handleAddVariation = () => {
    setVariations([...variations, { color: "", size: "", quantity: "" }]);
  };
  useEffect(() => {
    const tokenData = sessionStorage.getItem("decodedToken");

    if (tokenData) {
      const parsedUserData: UserData = JSON.parse(tokenData);
      console.log("sasas", parsedUserData);
      setUserData(parsedUserData);
    }
  }, []);

  const [addNewItem, setAddNewItem] = useState(false);
  const [buttonName, setButtonName] = useState("Add New Item");

  const addNewProductSubmit = async (values: any) => {};

  const name = "aa";
  const getUserDataByEmail = async () => {
    try {
      const response = await findUserByEmail("mgrwijethilaka@gmail.com");
      console.log("getByEmail", response);

      // Accessing the firstName property
      const firstName = response?.firstName;
      console.log("First Name:", firstName);

      // Now you can use the firstName in your React component's state or JSX
    } catch (error) {
      console.error("Error:", error);
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
  const addNewItemFormSubmit = async (values: any) => {
    try {
    } catch (error) {}
  };
  return (
    <div className="seller-product-list">
      <div className="container">
        <p className="addNewProdBtn" onClick={handleToggle}>
          {buttonName}
        </p>
        <br />
        {addNewItem ? (
          <div>
            {" "}
            <table className="table table-striped item-table">
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Image</th>
                  <th scope="col">Name</th>
                  <th scope="col">Category</th>
                  <th scope="col">Price</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td scope="row">1</td>
                  <td>
                    {" "}
                    <img
                      className="product-img"
                      src="https://media.licdn.com/dms/image/C5103AQEuXTCBE_RUEQ/profile-displayphoto-shrink_800_800/0/1568432085578?e=2147483647&v=beta&t=9Xpp44b5g1LtUmkYbI1oD69SnDGSaPiWH3qJ5PpDKko"
                      alt="Product-img"
                    />
                  </td>
                  <td>Hellio Frock</td>
                  <td>Womens</td>
                  <td>$25.99</td>
                  <td>
                    <i
                      className="bi bi-eye-fill actions-tab"
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="View More"
                      data-tooltip-place="top"
                    ></i>
                    <i
                      className="bi bi-pencil-square actions-tab"
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Edit"
                      data-tooltip-place="top"
                    ></i>
                    <i
                      className="bi bi-trash-fill"
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Delete"
                      data-tooltip-place="top"
                    ></i>

                    <Tooltip id="my-tooltip" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            {" "}
            <div className="new-item-form">
              <Formik
                initialValues={addNewItemFormInitialValues}
                validationSchema={addNewItemValidationSchema}
                onSubmit={addNewItemFormSubmit}
              >
                {({ values, handleChange, handleBlur, touched, errors }) => (
                  <Form>
                    <div className="field-container">
                      <div className="field-input">
                        <label>Product Name :</label>
                        <Field
                          type="text"
                          id="productName"
                          name="productName"
                        />
                      </div>

                      <ErrorMessage
                        name="productName"
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
                        <label>Price :</label>
                        <Field type="text" id="price" name="price" />
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
                              accept="image/*" // Allow only image files
                              id="fileInput"
                              className="file-input"
                              onChange={handleFileChange}
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
                      <button
                        className="btn btn-success addNew-success-button"
                        onClick={handleAddVariation}
                      >
                        +
                      </button>
                    </div>

                    {variations.map((variations, index) => (
                      <div key={index} className="field-container">
                        <div className="field-input">
                          <Field
                            type="text"
                            name={`variations[${index}].color`}
                            placeholder="Color"
                          />
                          <Field
                            type="text"
                            name={`variations[${index}].size`}
                            placeholder="Size"
                          />
                          <Field
                            type="text"
                            name={`variations[${index}].quantity`}
                            placeholder="Quantity"
                          />
                        </div>
                        <ErrorMessage
                          name={`variations[${index}].color`}
                          component="div"
                          className="error"
                        />
                        <ErrorMessage
                          name={`variations[${index}].size`}
                          component="div"
                          className="error"
                        />
                        <ErrorMessage
                          name={`variations[${index}].quantity`}
                          component="div"
                          className="error"
                        />
                      </div>
                    ))}
                    {/* <div className="field-container">
                      <div className="preview-main">
                        <div className="preview">
                          {selectedFile && (
                            <div>
                              <div>
                                {imageSrc && (
                                  <img src={imageSrc} alt="Selected" />
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div> */}

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
    </div>
  );
};

export default SellerProductList;
