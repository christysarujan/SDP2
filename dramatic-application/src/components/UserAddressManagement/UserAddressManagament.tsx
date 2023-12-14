import React, { ChangeEvent, useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {
  loginInitialValues,
  loginValidationSchema,
  paymentTypeFilterInitialValues,
  paymentTypeFilterValidationSchema,
} from "../../utils/Validation";
import "./UserAddressManagement.scss";
import {
  addNewAddressInitialValues,
  addNewAddressValidationSchema,
} from "../../utils/Validation";
import { Tooltip } from "react-tooltip";
import { addUserAddress, deleteUserAddress, findUserByEmail, findUsersAddressByType } from "../../services/apiService";

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

interface Address {
  id: string;
  addressType: string;
  addressLine_01: string;
  addressLine_02: string;
  city: string;
  zipCode: string;
  province: string;
  country: string;
  countryCode: string;
  mobileNo: string;
}

const UserAddressManagement = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [variations, setVariations] = useState([
    { color: "", size: "", quantity: "" },
  ]);

  const [addressType, setAddressType] = useState('Shipping')

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

  const addNewProductSubmit = async (values: any) => { };

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
  const addNewAddressFormSubmit = async (values: any, { resetForm }: any) => {
    try {
      console.log('Address Details :', values);
      const email = sessionStorage.getItem('email');
      const addressSubmit = await addUserAddress(email, values);
    } catch (error) { }
    finally {
      resetForm();
      handleToggle();
    }
  };


  const filterAddressType = async (e: any) => {
    try {
      const email = sessionStorage.getItem('email');
      const addressType = e.target.value
      setAddressType(addressType);
      // console.log(addressType);
      const userAddress = await findUsersAddressByType(email, addressType)
      setAddresses(prevState => userAddress);
      // setAddresses(userAddress);
    } catch (error) {
      console.error('Error fetching data:', error);

    }
  };

  const getBillingAddress = async () => {
    try {
      const email = sessionStorage.getItem('email');
      const userAddress = await findUsersAddressByType(email, addressType)

      setAddresses(userAddress);
    } catch (error) {
      console.error('Error fetching data:', error);

    }
  };
  useEffect(() => {
    getBillingAddress();
  }, []);
  useEffect(() => {
    getBillingAddress();
  }, [addNewAddress]);

  const deleteAddress = async (id: any) => {
    const addressDelete = await deleteUserAddress(id)
    getBillingAddress();
  }

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

              <div className="field-container">
                <div className="field-input">
                  <label>Address Type :</label>
                  <select
                    id="paymentType"
                    name="paymentType"
                    onChange={(e: any) => filterAddressType(e)}
                  >
                    {/* <option value="" label="-- Select Address Type --">-- Select Address Type --</option> */}
                    <option value="Shipping" label="Shipping" >Shipping</option>
                    <option value="Billing" label="Billing">Billing</option>
                  </select>
                </div>
              </div>

              <hr />
              <br />
            </div>
            <div className="address-component">
              <div className="row">
                <div className="col-md-11" >
                  {addresses && addresses.map((address) => (
                    <div key={address.id}>
                      <p>{address.addressLine_01},{address.addressLine_02},{address.city},{address.province},{address.zipCode},{address.country},{address.mobileNo}</p>
                      <button onClick={() => deleteAddress(address.id)}>Delete</button>
                    </div>
                  ))}

                </div>
                <div className="col-md-1">
                  <i
                    className="bi bi-pencil-square actions-tab"
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Edit"
                    data-tooltip-place="top"
                  ></i>
                  <i
                    className="bi bi-trash-fill p-3"
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
                onSubmit={addNewAddressFormSubmit}
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
                          id="addressLine_02"
                          name="addressLine_02"
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
