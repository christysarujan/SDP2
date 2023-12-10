import React, { ChangeEvent, useEffect, useState } from "react";
import "./AuthForm.scss";
import { countries } from "countries-list";
import { jwtDecode } from "jwt-decode";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { userRegistration } from '../../services/apiService'

import { userRegValidationSchema } from "../../utils/Validation";

import { regFormInitialValues } from "../../utils/Validation";
import Login from "./Login/Login";
import ResetPassword from "./ResetPassword/ResetPassword";


const getCountryOptions = () => {
  return Object.keys(countries).map((countryCode) => ({
    value: countryCode,
    label: (countries as any)[countryCode].name,
  }));
};

const token = "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJuaW1hbCIsInJvbGUiOiJVU0VSIiwiaXNzIjoiZWNvbW1lcmNlX2F1dGhfc2VydmVyIiwiZXhwIjoxNzAxNDUzMDczLCJpYXQiOjE3MDEyMzcwNzMsImVtYWlsIjoibW9oYW1lZGF5eWFzaDI3QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoibmltYWwifQ.Lk67iR_en2mqMoNysrE7mSUFukFwLc9VCQMZsWCDFmJ_e8YEJd-14xQsgiuYOxhXTIf6pbU0ar6XaqQAdaXwYx7qNAGyVMcObfbTJGoJxlLU_vPxkzGjLl3L91HacXdWe3wpmskr2iwM_NkhmnrjTNnZiSnV5wh_8hi5Z7SUvKeGQ58BbqDtcTdDrw9Y4eE9qpvzOaZ39iteJOhKx2BdilMg0yJymgIJq0uiGZtgxLPCtzPlqY5vQmlRFf_fpDyz2paxLUVlLqWNixCmoQUZMSP1FrejRh779FZ8EeAgNK95ik0W39BzlQSaphrtKZfM2rMOs3n4O9nlitHRFHTRgg";

const AuthForm = () => {

  const countryOptions = getCountryOptions();
  //   console.log(countryOptions);
  const [isSliderClicked, setIsSliderClicked] = useState(true);
  const [buttonName, setButtonName] = useState("Sign Up");
  const [decodedToken, setDecodedToken] = useState<any>({});
  const [isUserRegistration, setIsUserRegistration] = useState(true);
  const [forgetPassword, setForgetPassword] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleForgetPassword = () => {
    setForgetPassword((prev) => !prev);
  };

  /* useEffect(() => {
    setDecodedToken(jwtDecode(token));
  }, []);

  console.log('decode token', decodedToken); */

  const handleSliderClickUser = () => {
    setIsSliderClicked((prev) => !prev);

    if (isSliderClicked) {
      setButtonName("Sign In");
      setIsUserRegistration(true)
    } else {
      setButtonName("Sign Up");
    }
  };
  const handleSliderClickSeller = () => {
    setIsSliderClicked((prev) => !prev);

    if (isSliderClicked) {
      setButtonName("Sign In");
      setIsUserRegistration(false)
    } else {
      setButtonName("Sign Up");
    }
  };

  const handleToggle = () => {
    setIsUserRegistration((prev) => !prev);
  };

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {

    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file)
    }
    console.log('select file', selectedFile);
  }

  const regFormSubmit = async (values: any) => {
    setLoading(true)
    const formData = new FormData();

    formData.append('username', values.username);
    formData.append('password', values.password);
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('email', values.email);
    formData.append('gender', values.gender);
    formData.append('dob', values.dob);


    if (isUserRegistration) {
      console.log("user");
      formData.append('role', 'user');
    } else {
      console.log("seller");
      formData.append('role', 'seller');

    }
    if (selectedFile) {
      formData.append('profileImage', selectedFile, selectedFile.name);
      console.log('qqqqqqqq', selectedFile);
    }

    const userReg = await userRegistration(formData);

    if (userReg) {
      setLoading(false)
    } else {
      setLoading(false)
    }
  }

  return (
    <div className="auth-main">
      <div className="auth-form-main">
        <div className="forms">
          <div className="form-container">
            <div className="sign-in-form">
              <p className="welcome-msg">Welcome Back!</p>
              {forgetPassword ? (
                <div>
                  <Login />
                  <p className="forget-pwd" onClick={handleForgetPassword}>Forget Password</p>
                  <div className="login-options">
                    <p>Login with:</p>
                    <div className="social-icons">
                      <i className="bi bi-google"></i>
                      <i className="bi bi-facebook"></i>
                    </div>
                  </div>
                </div>

              ) : (
                <div>
                  <ResetPassword />
                  <p className="forget-pwd" onClick={handleForgetPassword}>Back</p>
                </div>


              )}

            </div>
            <div className="sign-up-form">
              <div
                className={`toggle-switch ${isUserRegistration ? "user-registration" : "seller-registration"
                  }`}
              >
                <div className="toggle-labels">
                  <span
                    onClick={handleToggle}
                    className={`label ${isUserRegistration ? "active" : ""}`}
                  >
                    User Registration
                  </span>
                  <span
                    onClick={handleToggle}
                    className={`label ${!isUserRegistration ? "active" : ""}`}
                  >
                    Seller Registration
                  </span>
                </div>
                <div className="toggle-handle" onClick={handleToggle}></div>
              </div>
              <div className="reg-forms">
                <div className="user-registration">
                  <Formik
                    initialValues={regFormInitialValues}
                    validationSchema={userRegValidationSchema}
                    onSubmit={regFormSubmit}
                  >
                    {({ values, handleChange, handleBlur, touched, errors }) => (
                      <Form>
                        <div className="form-names">
                          <div className="field-container">
                            <Field
                              type="text"
                              id="firstName"
                              name="firstName"
                              placeholder='First Name'
                            />
                            <ErrorMessage name="firstName" component="div" className="error" />
                          </div>
                          <div className="field-container">
                            <Field
                              type="text"
                              id="lastName"
                              name="lastName"
                              placeholder='Last Name'
                            />
                            <ErrorMessage name="lastName" component="div" className="error" />
                          </div>
                        </div>

                        <div className="field-container">
                          <Field
                            type="text"
                            id="username"
                            name="username"
                            placeholder='User Name'
                          />
                          <ErrorMessage name="username" component="div" className="error" />
                        </div>
                        <div className="field-container">
                          <Field
                            type="text"
                            id="email"
                            name="email"
                            placeholder='Email'
                          />
                          <ErrorMessage name="email" component="div" className="error" />
                        </div>

                        <div className="field-container">
                          <Field
                            type="password"
                            id="password"
                            name="password"
                            placeholder='Password'
                          />
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="error"
                          />
                        </div>
                        <div className="field-container">

                          <Field
                            as="select"
                            id="gender"
                            name="gender"
                            placeholder="Select Gender"
                            className="custom-select"
                          >
                            <option value="" label="Select Gender" />
                            <option value="male" label="Male" />
                            <option value="female" label="Female" />
                          </Field>
                          <ErrorMessage
                            name="gender"
                            component="div"
                            className="error"
                          />
                        </div>
                        <div className="field-container">

                          <Field

                            id="dob"
                            name="dob"
                            type="date"
                            placeholder="scaccaecac"
                            value={values.dob || ''}


                          />
                          <ErrorMessage
                            name="dob"
                            component="div"
                            className="error"
                          />
                        </div>
                        <div className="field-container">
                          <Field
                            id="profileImage"
                            name="profileImage"
                            type="file"
                            placeholder="profileImage"
                            onChange={handleImage}
                          />
                          <ErrorMessage
                            name="profileImage"
                            component="div"
                            className="error"
                          />
                        </div>

                        <div className="field-container">
                          {/* <button className="sub-btn" type="submit">Register</button> */}
                          <button className="sub-btn" type="submit" disabled={loading}> {loading ? (<div className='loader'>
                            <span>Loading...</span>
                            <div className="spinner" />
                          </div>) : 'Register'}</button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
          <div className={`slider ${isSliderClicked ? "slider-clicked" : ""}`}>
            {/* {isSliderClicked && <div></div>} */}
            {isSliderClicked ? (
              <div className="login-slide">

                <div className="img"></div>
                {/* <p>sa</p> */}
                <div className="login-content">
                  <p>Dont' you have an account ?</p>
                  <button
                    className="btn btn-outline-light slide-btn"
                    onClick={handleSliderClickUser}
                  >
                    {buttonName}
                  </button>
                  <p>Want to sell with us</p>
                  <button
                    className="btn btn-outline-light slide-btn"
                    onClick={handleSliderClickSeller}
                  >
                    Register Now
                  </button>
                </div>

              </div>
            ) : (
              <div className="reg-slide">

                <div className="img"></div>
                {/* <p>sa</p> */}
                <div className="login-content">
                  <p>Alredy have an account ?</p>
                  <button
                    className="btn btn-outline-light slide-btn"
                    onClick={handleSliderClickUser}
                  >
                    {buttonName}
                  </button>
                </div>

              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

