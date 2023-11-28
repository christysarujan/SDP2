// AuthForm.tsx
import React, { useEffect, useState } from "react";
import "./AuthForm.scss";

import { countries } from "countries-list";

const getCountryOptions = () => {
    return Object.keys(countries).map((countryCode) => ({
        value: countryCode,
        label: (countries as any)[countryCode].name,
    }));
};


/* const AuthForm = () => {
  return (
    <div>
      
    </div>
  )
} */




const AuthForm = () => {
    const countryOptions = getCountryOptions();
    //   console.log(countryOptions);
    const [isSliderClicked, setIsSliderClicked] = useState(true);
    const [buttonName, setButtonName] = useState("Sign Up");

    const handleSliderClick = () => {
        setIsSliderClicked((prev) => !prev);

        if (isSliderClicked) {
            setButtonName("Sign In");
        } else {
            setButtonName("Sign Up");
        }
    };

    const [isUserRegistration, setIsUserRegistration] = useState(true);

    const handleToggle = () => {
        setIsUserRegistration((prev) => !prev);
    };

    const [userFormData, setUserFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        dob: "",
        role: "",
    });

    useEffect(() => {
        if (isUserRegistration) {
            console.log("user")
            setUserFormData((prev) => ({ ...prev, role: 'user' }));
        } else {
            setUserFormData((prev) => ({ ...prev, role: 'seller' }));
            console.log("seller")
        }
    }, [isUserRegistration])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setUserFormData((prev) => ({ ...prev, [name]: value }));
    };

    const 
    handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setUserFormData((prev) => ({ ...prev, role: 'user' }));
        /*   if(isUserRegistration){
              setUserFormData((prev) => ({ ...prev, role: 'user' }));
          } else {
              setUserFormData((prev) => ({ ...prev, role: 'seller' }));
          } */
        console.log("Form Data Submitted:", userFormData);
        setUserFormData({
            firstName: "",
            lastName: "",
            email: "",
            gender: "",
            dob: "",
            role: "",
        });
    };

    return (
        <div className="auth-form-main">
            <div className="forms">
                <div className="form-container">
                    <div className="sign-in-form">
                        <p className="welcome-msg">Welcome Back!</p>
                        <form>
                            <input
                                type="text"
                                id="username"
                                placeholder="Enter your username"
                            />
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                            />
                            <div className="forget-password">
                                <a href="#">Forgot your password?</a>
                            </div>
                            <button type="submit">Sign In</button>
                        </form>
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
                                <form className="registration-form" onSubmit={handleSubmit}>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={userFormData.firstName}
                                        onChange={handleChange}
                                    />

                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={userFormData.lastName}
                                        onChange={handleChange}
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={userFormData.email}
                                        onChange={handleChange}
                                    />

                                    <select
                                        name="gender"
                                        value={userFormData.gender}
                                        onChange={handleChange}
                                        className="custom-select"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>

                                    <input
                                        type="date"
                                        name="dob"
                                        value={userFormData.dob}
                                        onChange={handleChange}
                                    />

                                    <button type="submit">Submit</button>
                                </form>
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
