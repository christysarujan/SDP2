import React, { ChangeEvent, useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";

import "./SellerPaymentDetails.scss";
import {
  addNewPaymentTypeInitialValues,
  addNewPaymentTypeValidationSchema,
  bankFormInitialValues,
  bankFormValidationSchema,
  paypalFormInitialValues,
  paypalFormValidationSchema,
} from "../../utils/Validation";
import { getSellerPaymentInfoByEmail, paymentDataDelete, paymentDataEdit, paymentDataSubmit } from "../../services/apiService";

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
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [editFormStatus, setEditFormStatus] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    getPaymentDetails();
  }, []);

  const editPaymentInfoToggle = () => {
    setEditFormStatus((prev) => !prev);
  };


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
      await getPaymentDetails()
    } catch (error) {
      console.log(error);
    }
  };
  const bankFormSubmit = async (values: any) => {
    console.log('Payment form values', values);
    const email = sessionStorage.getItem("email");
    try {
      const bank = await paymentDataSubmit(email, bankType, values)
      await getPaymentDetails()
    } catch (error) {
      console.log(error);
    }
  };
  const paypalEditFormSubmit = async (values: any) => {
    console.log('Payment form values', values);
    const email = sessionStorage.getItem("email");
    try {
      const payment = await paymentDataEdit(email, bankType, values)
      await getPaymentDetails()
      await editPaymentInfoToggle()
    } catch (error) {
      console.log(error);
    }
  };

  const bankEditFormSubmit = async (values: any) => {
    console.log('Payment form values', values);
    const email = sessionStorage.getItem("email");
    try {
      const bank = await paymentDataEdit(email, bankType, values)
      await getPaymentDetails()
      await editPaymentInfoToggle()
    } catch (error) {
      console.log(error);
    }
  };

  const getPaymentDetails = async () => {
    const email = sessionStorage.getItem("email");
    try {
      const paymentInfo = await getSellerPaymentInfoByEmail(email);
      setPaymentDetails(paymentInfo);
      console.log('PaymentInfo', paymentInfo);

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

<<<<<<< Updated upstream
=======
  const toggleDeleteModal = () => {
    setShowDeleteModal((prev) => !prev);
  };

  function deletePaymentInfo(): void {
    const email = sessionStorage.getItem('email');
    paymentDataDelete(email)
      .then(() => {
        // Remove the deleted item from the paymentDetails state
        setPaymentDetails(null);
        // Optionally, want to reset editFormStatus as well
        setEditFormStatus(false);
        // Close the delete modal
        toggleDeleteModal();
        // Reload the page
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error deleting payment info:', error);
      });
  }

>>>>>>> Stashed changes

  return (
    <div className="seller-payment-main">

      {showDeleteModal && (
        <div className="delete-modal show-delete-modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this payment information?</p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={toggleDeleteModal}>Cancel</button>
              <button className="delete-btn" onClick={deletePaymentInfo}>Delete</button>
            </div>
          </div>
        </div>
      )}


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
                  key="paypalForm"
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
              ) : (
                <Formik
                  initialValues={bankFormInitialValues}
                  validationSchema={bankFormValidationSchema}
                  onSubmit={bankFormSubmit}
                  key="bankForm"
                >
                  {({ values, handleChange, handleBlur, touched, errors }) => (
                    <Form>
                      <div className="field-container">
                        <div className="field-input">
                          <label>Account No :</label>
                          <Field
                            type="text"
                            id="accountNo"
                            name="accountNo"
                          />
                        </div>
                        <ErrorMessage
                          name="accountNo"
                          component="div"
                          className="error"
                        />
                      </div>
                      <div className="field-container">
                        <div className="field-input">
                          <label>Account Holder Name :</label>
                          <Field
                            type="text"
                            id="accountHolderName"
                            name="accountHolderName"
                          />
                        </div>
                        <ErrorMessage
                          name="accountHolderName"
                          component="div"
                          className="error"
                        />
                      </div>
                      <div className="field-container">
                        <div className="field-input">
                          <label>Bank Name :</label>
                          <Field
                            type="text"
                            id="bankName"
                            name="bankName"
                          />
                        </div>
                        <ErrorMessage
                          name="bankName"
                          component="div"
                          className="error"
                        />
                      </div>
                      <div className="field-container">
                        <div className="field-input">
                          <label>Branch :</label>
                          <Field
                            type="text"
                            id="branch"
                            name="branch"
                          />
                        </div>
                        <ErrorMessage
                          name="branch"
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
              )}



            </div>
          )}
        </div>
      )
        : (
          <div className="seller-payment-details">
            <div className="payment-details">

              <div className="account-sum">
                {paymentDetails && paymentDetails['paypalAccountNo'] === null &&
                  <div>
                    <div className="bank-details">
                      <p className="header">Bank Account Details</p>
                      <p className="data">Account No : {`${paymentDetails['accountNo'] && paymentDetails['accountNo'] || '-'}`}</p>
                      <p className="data">Account Holder Name : {`${paymentDetails['accountHolderName'] && paymentDetails['accountHolderName'] || '-'}`}</p>
                      <p className="data">Bank Name : {`${paymentDetails['bankName'] && paymentDetails['bankName'] || '-'}`}</p>
                      <p className="data">Branch : {`${paymentDetails['branch'] && paymentDetails['branch'] || '-'}`}</p>
                    </div>
                  </div>
                  || paymentDetails && paymentDetails['bankName'] === null &&
                  <div className="bank-details">
                    <p className="header">Paypal Account Details</p>
                    <p className="data">Paypal Account No : {`${paymentDetails['paypalAccountNo'] && paymentDetails['paypalAccountNo'] || '-'}`}</p>
                    <p className="data">Paypal Email : {`${paymentDetails['paypalEmail'] && paymentDetails['paypalEmail'] || '-'}`}</p>
                    <p className="data">Account Type : {`${paymentDetails['accountType'] && paymentDetails['accountType'] || '-'}`}</p>
                  </div>
                }
              </div>
              <div className="edit-sum-btn">
                <button className="btn btn-success" onClick={() => editPaymentInfoToggle()}><i className="bi bi-pencil-square"></i></button>
              </div>
              <div className="delete-btn">
                <button className="btn btn-danger" onClick={toggleDeleteModal}><i className="bi bi-trash"></i></button>

              </div>

            </div>
            {editFormStatus &&
              <div className="edit-form">
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
                      onSubmit={paypalEditFormSubmit}
                      key="paypalFormEdit"
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
                  ) : (
                    <Formik
                      initialValues={bankFormInitialValues}
                      validationSchema={bankFormValidationSchema}
                      onSubmit={bankEditFormSubmit}
                      key="bankFormEdit"
                    >
                      {({ values, handleChange, handleBlur, touched, errors }) => (
                        <Form>
                          <div className="field-container">
                            <div className="field-input">
                              <label>Account No :</label>
                              <Field
                                type="text"
                                id="accountNo"
                                name="accountNo"
                              />
                            </div>
                            <ErrorMessage
                              name="accountNo"
                              component="div"
                              className="error"
                            />
                          </div>
                          <div className="field-container">
                            <div className="field-input">
                              <label>Account Holder Name :</label>
                              <Field
                                type="text"
                                id="accountHolderName"
                                name="accountHolderName"
                              />
                            </div>
                            <ErrorMessage
                              name="accountHolderName"
                              component="div"
                              className="error"
                            />
                          </div>
                          <div className="field-container">
                            <div className="field-input">
                              <label>Bank Name :</label>
                              <Field
                                type="text"
                                id="bankName"
                                name="bankName"
                              />
                            </div>
                            <ErrorMessage
                              name="bankName"
                              component="div"
                              className="error"
                            />
                          </div>
                          <div className="field-container">
                            <div className="field-input">
                              <label>Branch :</label>
                              <Field
                                type="text"
                                id="branch"
                                name="branch"
                              />
                            </div>
                            <ErrorMessage
                              name="branch"
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
                  )}



                </div>
              </div>
            }


          </div>)}


    </div>

  );
};

export default SellerPaymentDetails;
