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
import { addProduct, findUserByEmail } from "../../services/apiService";

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
  const [variation, setVariations] = useState([
    { color: "", size: "", quantity: "" },
  ]);
  const handleAddVariation = () => {
    setVariations([...variation, { color: "", size: "", quantity: "" }]);
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

  const addProductFormSubmit = async (values: any) => {
    console.log('Product form values', values);


    try {
      const email = sessionStorage.getItem("email");
      const productDataForm = new FormData();

      if(email){
        productDataForm.append('sellerEmail', email);
      }
      productDataForm.append('name', values.name);
      productDataForm.append('category', values.category);
      productDataForm.append('material', values.material);
      productDataForm.append('price', values.price);
      // productDataForm.append('variation', values.variation);
      productDataForm.append('variation', JSON.stringify(values.variation));


      if (selectedFile) {
        productDataForm.append('productImages', selectedFile, selectedFile.name);
    }

      console.log('productDataForm:', productDataForm);
      for (const entry of productDataForm.entries()) {
        console.log(entry[0], ':', entry[1]);
      }

      const products = await addProduct(productDataForm);

    } catch (error) { }
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
                      src="https://th.bing.com/th/id/R.2b1935c6d3eb13ad67f1748c3790c914?rik=HZfvzIeD%2fiEOlg&riu=http%3a%2f%2fstylearena.net%2fwp-content%2fuploads%2f2015%2f04%2f6-velvet-red-anarkali-frocks.jpg&ehk=naaX%2bMI%2b6QMnvsFo6jgWZZNyPhR%2b7ww8nnyYBB%2b2mng%3d&risl=&pid=ImgRaw&r=0"
                      alt="Product-img"
                    />
                  </td>
                  <td>Hellio Frock</td>
                  <td>Women</td>
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

                    {variation.map((variation, index) => (
                      <div key={index} className="field-container">
                        <div className="field-input">
                          <Field
                            type="text"
                            name={`variation[${index}].color`}
                            placeholder="Color"
                          />
                          <Field
                            type="text"
                            name={`variation[${index}].size`}
                            placeholder="Size"
                          />
                          <Field
                            type="text"
                            name={`variation[${index}].quantity`}
                            placeholder="Quantity"
                          />
                        </div>
                        <ErrorMessage
                          name={`variation[${index}].color`}
                          component="div"
                          className="error"
                        />
                        <ErrorMessage
                          name={`variation[${index}].size`}
                          component="div"
                          className="error"
                        />
                        <ErrorMessage
                          name={`variation[${index}].quantity`}
                          component="div"
                          className="error"
                        />
                      </div>
                    ))}
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
