import React, { ChangeEvent, useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {
  loginInitialValues,
  loginValidationSchema,
} from "../../utils/Validation";
import "./SellerPaymentDetails.scss";
import {
  addNewPaymentTypeInitialValues,
  addNewPaymentTypeValidationSchema,
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

const SellerPaymentDetails = () => {
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

  const [editPaymentDetails, setEditPaymentDetails] = useState(true);
  const [buttonName, setButtonName] = useState("Edit Payment Details");

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
    setEditPaymentDetails((prev) => !prev);
    if (editPaymentDetails) {
      setButtonName("View Payment Details");
    } else {
      setButtonName("Edit Payment Details");
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
    <div className="seller-payment-details">
      <div className="container">
        <p className="addNewProdBtn" onClick={handleToggle}>
          {buttonName}
        </p>
        <br />
        {editPaymentDetails ? (
          <div>
            <hr /> <h5>Your Payment Information</h5>
            <div className="payment-details">
              <p>
                <b>Payment Type:</b> Paypal
              </p>

              <p>
                <b>Account Number:</b> 1234456879
              </p>
              <p>
                <b>Account Holders Name:</b> Kishu Gomez
              </p>
              <p>
                <b>Bank Name:</b> Hatton Nationl Bank
              </p>
              <p>
                <b>Branch Name:</b> Colombo 11
              </p>

              <p>
                <b>Paypal Email: </b> Kishu Gomez
              </p>
              <p>
                <b>Account Type:</b> Hatton Nationl Bank
              </p>
              <p>
                <b>Account Number:</b> Colombo 11
              </p>
            </div>
          </div>
        ) : (
          <div>
            {" "}
            <div className="new-item-form">
              <Formik
                initialValues={addNewPaymentTypeInitialValues}
                validationSchema={addNewPaymentTypeValidationSchema}
                onSubmit={addNewItemFormSubmit}
              >
                {({ values, handleChange, handleBlur, touched, errors }) => (
                  <Form>
                    <div className="field-container">
                      <div className="field-input">
                        <label>Payment Type :</label>
                        <Field
                          as="select"
                          id="paymentType"
                          name="paymentType"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.paymentType}
                        >
                          <option value="" label="Select a Payment Type" />
                          <option value="bank" label="Bank" />
                          <option value="paypal" label="Paypal" />
                        </Field>
                      </div>

                      <ErrorMessage
                        name="paymentType"
                        component="div"
                        className="error"
                      />
                    </div>
                    {values.paymentType === "bank" && (
                      <>
                        <hr />
                        <div className="field-container">
                          <div className="field-input">
                            <label>Account Number :</label>
                            <Field
                              type="text"
                              id="accNumber"
                              name="accNumber"
                            />
                          </div>
                          <ErrorMessage
                            name="accNumber"
                            component="div"
                            className="error"
                          />
                        </div>
                        <div className="field-container">
                          <div className="field-input">
                            <label>Account Holder's Name :</label>
                            <Field
                              type="text"
                              id="accHoldersName"
                              name="accHoldersName"
                            />
                          </div>
                          <ErrorMessage
                            name="accHoldersName"
                            component="div"
                            className="error"
                          />
                        </div>
                        <div className="field-container">
                          <div className="field-input">
                            <label>Bank Name :</label>
                            <Field type="text" id="bankName" name="bankName" />
                          </div>
                          <ErrorMessage
                            name="bankName"
                            component="div"
                            className="error"
                          />
                        </div>
                        <div className="field-container">
                          <div className="field-input">
                            <label>Branch Name :</label>
                            <Field
                              type="text"
                              id="branchName"
                              name="branchName"
                            />
                          </div>
                          <ErrorMessage
                            name="branchName"
                            component="div"
                            className="error"
                          />
                        </div>
                      </>
                    )}
                    {values.paymentType === "paypal" && (
                      <>
                        <hr />
                        <div className="field-container">
                          <div className="field-input">
                            <label>Paypal Email :</label>
                            <Field
                              type="text"
                              id="paypalEmail"
                              name="paypalEmail"
                            />
                          </div>
                          <ErrorMessage
                            name="paypalEmail"
                            component="div"
                            className="error"
                          />
                        </div>
                        <div className="field-container">
                          <div className="field-input">
                            <label>Account Type :</label>
                            <Field
                              type="text"
                              id="accountType"
                              name="accountType"
                            />
                          </div>
                          <ErrorMessage
                            name="accountType"
                            component="div"
                            className="error"
                          />
                        </div>
                        <div className="field-container">
                          <div className="field-input">
                            <label>Account Number :</label>
                            <Field
                              type="text"
                              id="accountNumber"
                              name="accountNumber"
                            />
                          </div>
                          <ErrorMessage
                            name="accountNumber"
                            component="div"
                            className="error"
                          />
                        </div>
                      </>
                    )}

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

export default SellerPaymentDetails;
