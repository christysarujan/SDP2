// AuthForm.tsx
import React, { useState } from 'react';
import './AuthForm.scss';

import { countries } from 'countries-list';

const getCountryOptions = () => {
    return Object.keys(countries).map((countryCode) => ({
        value: countryCode,
        label: (countries as any)[countryCode].name,
    }));
};

const AuthForm: React.FC = () => {

    const countryOptions = getCountryOptions();
    console.log(countryOptions);
    const [isSliderClicked, setIsSliderClicked] = useState(false);
    const [buttonName, setButtonName] = useState('Sign Up')

    const handleSliderClick = () => {
        setIsSliderClicked((prev) => !prev);

        if (isSliderClicked) {
            setButtonName('Sign In')
        } else {
            setButtonName('Sign Up')
        }
    };

    const [isUserRegistration, setIsUserRegistration] = useState(true);

    const handleToggle = () => {
        setIsUserRegistration((prev) => !prev);
    };

    const [userFormData, setUserFormData] = useState({
        userId: '',
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        dob: '',
        profileImage: '',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        zipCode: '',
        country: '',
        countryCode: '',
        mobile: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Data Submitted:', userFormData);
        setUserFormData({
            userId: '',
            firstName: '',
            lastName: '',
            email: '',
            gender: '',
            dob: '',
            profileImage: '',
            addressLine1: '',
            addressLine2: '',
            addressLine3: '',
            zipCode: '',
            country: '',
            countryCode: '',
            mobile: '',
        });
    };

    return (
        <div className="auth-form-main">
            <div className="forms">
                <div className="form-container">
                    <div className="sign-in-form">
                        <p>Sign In Form</p>
                        <form>
                            <label htmlFor="username">Username:</label>
                            <input type="text" id="username" placeholder="Enter your username" />
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" placeholder="Enter your password" />
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
                        <div className={`toggle-switch ${isUserRegistration ? 'user-registration' : 'seller-registration'}`}>
                            <div className="toggle-labels">
                                <span onClick={handleToggle} className={`label ${isUserRegistration ? 'active' : ''}`}>User Registration</span>
                                <span onClick={handleToggle} className={`label ${!isUserRegistration ? 'active' : ''}`}>Seller Registration</span>
                            </div>
                            <div className="toggle-handle" onClick={handleToggle}></div>
                        </div>
                        <div className="reg-forms">
                            {isUserRegistration && <div className="user-registation">
                                <form className="registration-form" onSubmit={handleSubmit}>
                                    <label>
                                        User ID:
                                        <input placeholder='User ID:' type="text" name="userId" value={userFormData.userId} onChange={handleChange} />
                                    </label>
                                    <label>
                                        First Name:
                                        <input type="text" name="firstName" value={userFormData.firstName} onChange={handleChange} />
                                    </label>
                                    <label>
                                        Last Name:
                                        <input type="text" name="lastName" value={userFormData.lastName} onChange={handleChange} />
                                    </label>
                                    <label>
                                        Email:
                                        <input type="email" name="email" value={userFormData.email} onChange={handleChange} />
                                    </label>
                                    <label>
                                        Gender:
                                        <select name="gender" value={userFormData.gender} onChange={handleChange}>
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </label>
                                    <label>
                                        Date of Birth:
                                        <input type="date" name="dob" value={userFormData.dob} onChange={handleChange} />
                                    </label>
                                    <label>
                                        Profile Image URL:
                                        <input type="text" name="profileImage" value={userFormData.profileImage} onChange={handleChange} />
                                    </label>
                                    <label>
                                        Address Line 1:
                                        <input type="text" name="addressLine1" value={userFormData.addressLine1} onChange={handleChange} />
                                    </label>
                                    <label>
                                        Address Line 2:
                                        <input type="text" name="addressLine2" value={userFormData.addressLine2} onChange={handleChange} />
                                    </label>
                                    <label>
                                        Address Line 3:
                                        <input type="text" name="addressLine3" value={userFormData.addressLine3} onChange={handleChange} />
                                    </label>
                                    <label>
                                        Zip Code/Province/State:
                                        <input type="text" name="zipCode" value={userFormData.zipCode} onChange={handleChange} />
                                    </label>
                                    <label>
                                        Country:
                                        <select>
                                            {countryOptions.map((option, index) => (
                                                <option key={index} value={option.label}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label>
                                        Country Code:
                                        <input type="text" name="countryCode" value={userFormData.countryCode} onChange={handleChange} />
                                    </label>
                                    <label>
                                        Mobile:
                                        <input type="text" name="mobile" value={userFormData.mobile} onChange={handleChange} />
                                    </label>
                                    <button type="submit">Submit</button>
                                </form>
                            </div>}
                            {!isUserRegistration && <button className="registration-button">Register as Seller</button>}
                        </div>
                    </div>

                </div>
                <div className={`slider ${isSliderClicked ? 'slider-clicked' : ''}`}>
                    <button onClick={handleSliderClick}>{buttonName}</button>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
