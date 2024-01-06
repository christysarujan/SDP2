import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import { ErrorMessage, Field, Form, Formik, FormikProps } from "formik";
import "./UserProfileEdit.scss";
import { Tooltip } from "react-tooltip";
import {
  regFormInitialValues,
  userDetailsUpdateSchema,
  resetPwdValidationSchema,
  resetPwdInitialValues,
} from "../../../utils/Validation";
import { findUserByEmail, updateUser, getPendingStoreApprovals, changePassword } from "../../../services/apiService";
import { useNavigate } from "react-router";

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

interface ProfileData {
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  gender: string;
  dob: Date;
  profileImage: string;
}

const UserProfileEdit = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>({
    username: "null",
    firstName: "null",
    lastName: "null",
    role: "null",
    email: "null",
    gender: " ",
    dob: new Date(),
    profileImage: "null",
  });

  useEffect(() => {
    const tokenData = sessionStorage.getItem("decodedToken");

    if (tokenData) {
      const parsedUserData: UserData = JSON.parse(tokenData);
      console.log("sasas", parsedUserData);
      setUserData(parsedUserData);
    }
  }, []);

  useEffect(() => {
    getUserDataByEmail();
  }, [userData]);

  useEffect(() => {
    console.log("hohohoh", profileData);
  }, [profileData]);

  const formRef = useRef<FormikProps<any>>(null);
  const modalRef = useRef(null);

  const modalReset = (form: FormikProps<any> | null) => {
    if (form) {
      form.resetForm({
        values: resetPwdInitialValues,
        errors: {},
        touched: {},
        isValidating: false,
        isSubmitting: false,
      });
    }
  };
  

  const [addNewItem, setAddNewItem] = useState(true);
  const [buttonName, setButtonName] = useState("Add New Item");


  const navigate = useNavigate();

  const navigateToHome = () =>{
    const role = sessionStorage.getItem("role");
    if(role === 'seller'){
      navigate("/store");
      window.location.reload();
    }else{
      navigate("/addressManagement");
      window.location.reload();
    }
    


  }

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
  const handleShowModal = () => {
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById("changePasswordModal"),
      { backdrop: "static" }
    );
    modal.show();
  };

  const getUserDataByEmail = async () => {
    try {
      const response = await findUserByEmail(userData?.email);
      console.log("resss", response);
      const {
        firstName,
        lastName,
        role,
        username,
        email,
        gender,
        dob,
        profileImage,
      } = response;
      setProfileData({
        username,
        firstName,
        lastName,
        role,
        email,
        gender,
        dob,
        profileImage,
      });
    } catch (error) {
      // console.error('Error in getUserDataByEmail:', error);
    }
  };
  const updateUserProfileFormSubmit = async (values: any) => {
    console.log("User Profile Values", values);

    try {
      const email = sessionStorage.getItem("email");
      const userDataForm = new FormData();

      userDataForm.append("username", values.username);
      userDataForm.append("firstName", values.firstName);
      userDataForm.append("lastName", values.lastName);
      userDataForm.append("gender", values.gender);
      userDataForm.append('dob', values.dob);

      console.log("userDataForm:", userDataForm);
 

      const products = await updateUser(email, userDataForm);
    } catch (error) {}
  };
  const updateUserPasswordSubmit = async (values: any) => {
    console.log("Password Values", values);

    try {
      const email = sessionStorage.getItem("email");
      const passwordDataForm = new FormData();

      passwordDataForm.append("currentPassword", values.currentPassword);
      passwordDataForm.append("newPassword", values.newPassword);


      console.log("userDataForm:", passwordDataForm);
 

      const products = await changePassword(email, passwordDataForm);
    } catch (error) {}
  };

  return (
    <div className="seller-product-list">
      <div className="container">
        <div>
          <br />
          <div className="top-form-hrader">
            <p className="addNewProdBtn" onClick={handleShowModal}>
              Change Passowrd
            </p>

            <p className="form-header">Update Profile</p>
          </div>
          <hr />{" "}
          <div className="user-data-form">
            <Formik
              enableReinitialize
              initialValues={{
                username: profileData?.username || "",
                firstName: profileData?.firstName || "",
                lastName: profileData?.lastName || "",
                email: profileData?.email || "",
                gender: profileData?.gender || "",
                dob: profileData?.dob || "",
              }}
              validationSchema={userDetailsUpdateSchema}
              onSubmit={updateUserProfileFormSubmit}
            >
              {({ values, handleChange, handleBlur, touched, errors }) => (
                <Form>
                  <div className="field-container">
                    <div className="field-input">
                      <label>Username :</label>
                      <Field
                        type="text"
                        id="username"
                        name="username"
                        disabled
                      />
                    </div>

                    <ErrorMessage
                      name="username"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div className="field-container">
                    <div className="field-input">
                      <label>First Name :</label>
                      <Field type="text" id="firstName" name="firstName" />
                    </div>
                    <ErrorMessage
                      name="firstname"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div className="field-container">
                    <div className="field-input">
                      <label>Last Name :</label>
                      <Field type="text" id="lastName" name="lastName" />
                    </div>
                    <ErrorMessage
                      name="lastname"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div className="field-container">
                    <div className="field-input">
                      <label>Email :</label>
                      <Field type="email" id="email" name="email" disabled />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div className="field-container">
                    <div className="field-input">
                      <label>Gender :</label>
                      <Field as="select" id="gender" name="gender">
                        <option value="" label="Select a Gender" />
                        <option value="male" label="Male" />
                        <option value="female" label="Female" />
                        <option value="other" label="Other" />
                      </Field>
                    </div>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div className="field-container">
                    <div className="field-input">
                      <label>Date of Birth :</label>
                      <Field type="date" id="dob" name="dob" />
                    </div>
                    <ErrorMessage
                      name="dob"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div className="field-container">
                    <div className="buttons">
                      <button className="btn btn-secondary"
                      type="button"
                      onClick={() => navigateToHome()}
                      >Cancel</button>
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
          {/* Modal */}
          <div
            className="modal fade"
            id="changePasswordModal"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"

            // onHide={() => formRef.current.resetForm()}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Change Password
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => modalReset(formRef.current)}>

                  </button>
                </div>
                <div className="modal-body">
                  <div className="new-item-form">
                    <Formik
                      innerRef={formRef}
                      enableReinitialize={true}
                      initialValues={resetPwdInitialValues}
                      validationSchema={resetPwdValidationSchema}
                      onSubmit={updateUserPasswordSubmit}
                    >
                      {({
                        values,
                        handleChange,
                        handleBlur,
                        touched,
                        errors,
                      }) => (
                        <Form>
                          <div className="field-container">
                            <div className="field-input">
                              <label>Current Password :</label>
                              <Field
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                              />
                            </div>

                            <ErrorMessage
                              name="currentPassword"
                              component="div"
                              className="error"
                            />
                          </div>
                          <div className="field-container">
                            <div className="field-input">
                              <label>New Password :</label>
                              <Field
                                type="password"
                                id="newPassword"
                                name="newPassword"
                              />
                            </div>
                            <ErrorMessage
                              name="newPassword"
                              component="div"
                              className="error"
                            />
                          </div>
                          <div className="field-container">
                            <div className="field-input">
                              <label>Confirm Password :</label>
                              <Field
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                              />
                            </div>
                            <ErrorMessage
                              name="confirmPassword"
                              component="div"
                              className="error"
                            />
                          </div>
                          <div className="field-container">
                            <div className="buttons">
                              <button
                              type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={() => modalReset(formRef.current)}                              >
                                Cancel
                              </button>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileEdit;
