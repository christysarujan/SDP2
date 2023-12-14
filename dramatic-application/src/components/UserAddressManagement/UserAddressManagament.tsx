import React, { ChangeEvent, useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {
  loginInitialValues,
  loginValidationSchema,
} from "../../utils/Validation";
import "./UserAddressManagement.scss";
import {
  addNewAddressInitialValues,
  addNewAddressValidationSchema,
} from "../../utils/Validation";
import { Tooltip } from "react-tooltip";
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

const UserAddressManagement = () => {
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

  const [addNewAddress, setAddNewAddress] = useState(true);
  const [buttonName, setButtonName] = useState("Add New Address");

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
    setAddNewAddress((prev) => !prev);
    if (addNewAddress) {
      setButtonName("View My Address");
    } else {
      setButtonName("Add New Address");
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
    <div className="user-address-details">
      <div className="container">
        <p className="addNewProdBtn" onClick={handleToggle}>
          {buttonName}
        </p>
        <br />
        {addNewAddress ? (
          <div>
            <hr /> <h5>Choose the Address Type</h5>
            <div className="new-item-form">
              <Formik
                initialValues={addNewAddressInitialValues}
                validationSchema={addNewAddressValidationSchema}
                onSubmit={addNewItemFormSubmit}
              >
                {({ values, handleChange, handleBlur, touched, errors }) => (
                  <Form>
                    <div className="field-container">
                      <div className="field-input">
                        <label>Address Type :</label>
                        <Field
                          as="select"
                          id="paymentType"
                          name="paymentType"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.addressType}
                        >
                          <option value="shipping" label="Shipping" />
                          <option value="billing" label="Billing" />
                        </Field>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
              <hr />
              <br />
            </div>
            <div className="address-component">
              <div className="row">
                <div className="col-md-10">
                  <p>
                    1. Address Line 1, Addressline 2, City, province, zipcode
                    Country Telephone Number
                  </p>
                </div>
                <div className="col-md-2">
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
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {" "}
            <div className="new-item-form">
              <Formik
                initialValues={addNewAddressInitialValues}
                validationSchema={addNewAddressValidationSchema}
                onSubmit={addNewItemFormSubmit}
              >
                {({ values, handleChange, handleBlur, touched, errors }) => (
                  <Form>
                    <div className="field-container">
                      <div className="field-input">
                        <label>Address Type :</label>
                        <Field
                          as="select"
                          id="addressType"
                          name="addressType"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.addressType}
                        >
                          <option value="" label="Select Address Type" />
                          <option value="shipping" label="Shipping" />
                          <option value="billing" label="Billing" />
                        </Field>
                      </div>

                      <ErrorMessage
                        name="addressType"
                        component="div"
                        className="error"
                      />
                    </div>

                    <div className="field-container">
                      <div className="field-input">
                        <label>Address Line 1 :</label>
                        <Field type="text" id="addressLine_01" name="addressLine_01" />
                      </div>
                      <ErrorMessage
                        name="addressLine_01"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className="field-container">
                      <div className="field-input">
                        <label>Address Line 2 :</label>
                        <Field
                          type="text"
                          id="accHoldersName"
                          name="accHoldersName"
                        />
                      </div>
                      {/* <ErrorMessage
                        name="accHoldersName"
                        component="div"
                        className="error"
                      /> */}
                    </div>
                    <div className="field-container">
                      <div className="field-input">
                        <label>City :</label>
                        <Field type="text" id="city" name="city" />
                      </div>
                      <ErrorMessage
                        name="city"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className="field-container">
                      <div className="field-input">
                        <label>Zip Code :</label>
                        <Field type="text" id="zipCode" name="zipCode" />
                      </div>
                      <ErrorMessage
                        name="zipCode"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className="field-container">
                      <div className="field-input">
                        <label>Province :</label>
                        <Field
                          type="text"
                          id="province"
                          name="province"
                        />
                      </div>
                      <ErrorMessage
                        name="province"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className="field-container">
                      <div className="field-input">
                        <label>Country :</label>
                        <Field
                          type="text"
                          id="country"
                          name="country"
                        />
                      </div>
                      <ErrorMessage
                        name="country"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className="field-container">
                      <div className="field-input">
                        <label>Country Code :</label>
                        <Field
                          type="text"
                          id="countryCode"
                          name="countryCode"
                        />
                      </div>
                      <ErrorMessage
                        name="countryCode"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className="field-container">
                      <div className="field-input">
                        <label>Telephone Number :</label>
                        <Field
                          type="text"
                          id="mobileNo"
                          name="mobileNo"
                        />
                      </div>
                      <ErrorMessage
                        name="mobileNo"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className="field-container">
                      <div className="buttons">
                        <button
                          className="btn btn-secondary"
                          type="button"
                          onClick={handleToggle}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-success"
                          type="submit"
                          // Disable the submit button while the form is submitting
                          disabled={
                            /* Add your loading state or condition here */ false
                          }
                        >
                          {/** Add your loading indicator here if needed */}
                          {/** Use 'Loading...' or another UI element */}
                          {/** Example: loading ? <LoadingSpinner /> : 'Submit' */}
                          Submit
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

export default UserAddressManagement;
