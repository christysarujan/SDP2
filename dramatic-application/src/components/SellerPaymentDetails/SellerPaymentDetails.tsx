import React, { ChangeEvent, useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";

import "./SellerPaymentDetails.scss";
import {
  addNewPaymentTypeInitialValues,
  addNewPaymentTypeValidationSchema,
  paypalFormInitialValues,
  paypalFormValidationSchema,
} from "../../utils/Validation";
import { getSellerPaymentInfoByEmail, paymentDataSubmit } from "../../services/apiService";

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
  const [editPaymentDetails, setEditPaymentDetails] = useState(true);
  const [addPaymentDetails, setAddPaymentDetails] = useState(true);
  const [paymentDetailsStatus, setPaymentDetailsStatus] = useState(true);
  const [buttonName, setButtonName] = useState("Edit Payment Details");
  const [bankType, setBankType] = useState("paypal");

  useEffect(() => {
    getPaymentDetails();
  }, []);




  const handleToggle = () => {
    setEditPaymentDetails((prev) => !prev);
    if (editPaymentDetails) {
      setButtonName("View Payment Details");
    } else {
      setButtonName("Edit Payment Details");
    }
  };
  const addPaymentInfoToggle = () => {
    setAddPaymentDetails((prev) => !prev);

    if (editPaymentDetails) {
      setButtonName("View Payment Details");
    } else {
      setButtonName("Edit Payment Details");
    }
  };

  const paypalFormSubmit = async (values: any) => {
    console.log('Payment form values', values);
    const email = sessionStorage.getItem("email");
    try {
      const payment = await paymentDataSubmit(email, bankType, values)
    } catch (error) {
      console.log(error);
    }
  };
  const bankFormSubmit = async (values: any) => {
    console.log('Payment form values', values);
    try {
    } catch (error) { }
  };

  const getPaymentDetails = async () => {
    const email = sessionStorage.getItem("email");
    try {
      const paymentInfo = await getSellerPaymentInfoByEmail(email)

      if (paymentInfo) {
        console.log('Have payment Info');
        setPaymentDetailsStatus(false);
      } else {
        console.log('Dont Have payment Info');
        setPaymentDetailsStatus(true);

      }
    } catch (error) { }
  };

  const filterBankType = async (e: any) => {
    try {
      const email = sessionStorage.getItem('email');
      const bank = e.target.value
      setBankType(bank)
      console.log(bank);
      // const userAddress = await findUsersAddressByType(email, addressType)
      // setAddresses(prevState => userAddress);
      // setAddresses(userAddress);
    } catch (error) {
      console.error('Error fetching data:', error);

    }
  };

  return (
    <div className="seller-payment-main">
      {paymentDetailsStatus ? (
        /*  */
        <div className="seller-payment-main">
          {addPaymentDetails ? (
          <div className="seller-payment-default">
            <div className="img"></div>
            <p className="msg">It seems like you didn't add payment information yet.</p>
            <button className='create-btn' onClick={addPaymentInfoToggle} >Add New</button>
          </div>
          ) : (
          <div className="payment-form">
            <div className="field-container">
              <div className="field-input">
                <label>Address Type :</label>
                <select
                  id="paymentType"
                  name="paymentType"
                  onChange={(e: any) => filterBankType(e)}
                >
                  <option value="paypal" label="Paypal" >Paypal</option>
                  <option value="bank" label="Bank">Bank</option>
                </select>
              </div>
            </div>
            <hr />
            {bankType === 'paypal' ? (
              <Formik
                initialValues={paypalFormInitialValues}
                validationSchema={paypalFormValidationSchema}
                onSubmit={paypalFormSubmit}
              >
                {({ values, handleChange, handleBlur, touched, errors }) => (
                  <Form>
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
                          id="paypalAccountNo"
                          name="paypalAccountNo"
                        />
                      </div>
                      <ErrorMessage
                        name="paypalAccountNo"
                        component="div"
                        className="error"
                      />
                    </div>



                    <div className="field-container">
                      <div className="buttons">
                        <button
                          className="btn btn-secondary"
                          type="button"
                          onClick={addPaymentInfoToggle}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-success"
                          type="submit"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                    
                  </Form>
                )}
              </Formik>
            ) : (<div>Bank</div>)}

          </div>
          )}
        </div>
      )
        : (<div className="seller-payment-details">
          <div className="container">
           <p>Table</p>
          </div>
        </div>)}


    </div>

  );
};

export default SellerPaymentDetails;
