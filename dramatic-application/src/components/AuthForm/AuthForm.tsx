// AuthForm.tsx
import React, { ChangeEvent, useEffect, useState } from "react";
import "./AuthForm.scss";
import { countries } from "countries-list";
import { jwtDecode } from "jwt-decode";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { userLogin, userRegistration } from '../../services/apiService'
import { useNavigate } from "react-router-dom";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const navigate = useNavigate();

  const loginValidationSchema = Yup.object({
    username: Yup.string()
      .required("User Name is required"),
    password: Yup.string()
      .required("Password is required"),
  });
  const userRegValidationSchema = Yup.object({
    firstName: Yup.string()
      .required("First Name is required"),
    lastName: Yup.string()
      .required("Last Name is required"),
    username: Yup.string()
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required"),
    gender: Yup.string()
      .required("Gender is required"),
    dob: Yup.string()
      .required("DOB is required")

  });

  const loginInitialValues = {
    username: "mgrw",
    password: "1234",
  };
  const regFormInitialValues = {
    firstName: "Gihan",
    lastName: "Ravindrajith",
    username: "mgrw",
    password: "1234",
    email: "mgrwijethilaka@gmail.com",
    gender: "male",
    dob: "1998-06-15",
    role: "user",
    mobileNo: "07712345678",
  };

  /*   useEffect(() => {
      setDecodedToken(jwtDecode(token));
    }, []);
  
    console.log('decode token', decodedToken); */

  const handleSliderClick = () => {
    setIsSliderClicked((prev) => !prev);

    if (isSliderClicked) {
      setButtonName("Sign In");
    } else {
      setButtonName("Sign Up");
    }
  };



  const handleToggle = () => {
    setIsUserRegistration((prev) => !prev);
  };

  const loginSubmit = async (values: any) => {
    console.log(values);
    const login = await userLogin(values);
    //  console.log('sascascc',login);

    if (login) {
      navigate("/")
    } else {
      alert('Crediential Invalid')
    }

  }


  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {

    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file)
    }

    console.log('select file', selectedFile);
  }

  const regFormSubmit = async (values: any) => {

    const formData = new FormData();

    formData.append('username', values.username);
    formData.append('password', values.password);
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('email', values.email);
    formData.append('gender', values.gender);
    formData.append('dob', values.dob);
    formData.append('mobileNo', values.mobileNo);

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

    userRegistration(formData);
  }

  return (
    <div className="auth-form-main">
      <div className="forms">
        <div className="form-container">
          <div className="sign-in-form">
            <p className="welcome-msg">Welcome Back!</p>
            <Formik
              initialValues={loginInitialValues}
              validationSchema={loginValidationSchema}
              onSubmit={loginSubmit}
            >
              {({ values, handleChange, handleBlur, touched, errors }) => (
                <Form>
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
                    <button className="sub-btn" type="submit">Login</button>
                  </div>
                </Form>
              )}
            </Formik>
            <div className="login-options">
              <p>Login with:</p>
              <div className="social-icons">
                <i className="bi bi-google"></i>
                <i className="bi bi-facebook"></i>
              </div>
            </div>
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
                        <button className="sub-btn" type="submit">Register</button>
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
          <button
            className="btn btn-outline-light slider-btn"
            onClick={handleSliderClick}
          >
            {buttonName}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
