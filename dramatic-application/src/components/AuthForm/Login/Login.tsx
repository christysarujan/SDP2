import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { loginInitialValues, loginValidationSchema } from '../../../utils/Validation';
import { findUserByEmail, getAllNotificationsBySellerEmail, getCartsByUserId, userLogin } from '../../../services/apiService';
import { useCart } from '../../Cart/CartContext';
import GetOpenNotificationCount from '../../Notification/GetOpenNotificationCount';
import handleAlert from '../../Notification/handleAlert';


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

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const { setCartCount } = useCart();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [emailNow, setEmailNow] = useState('');

    
    const loginSubmit = async (values: any) => {
        setLoading(true);
        try {
            const login = await userLogin(values);
    
            if (login && login.accessToken) {
                const accessToken = login.accessToken;
                const tokenDecode: any = jwtDecode(accessToken);
                const email = tokenDecode.email;
                const role = tokenDecode.role;
    
                sessionStorage.setItem('decodedToken', JSON.stringify(tokenDecode));
                sessionStorage.setItem('email', email);
                sessionStorage.setItem('role', role);
                sessionStorage.setItem('userData', JSON.stringify(login));
    
                const tokenData = sessionStorage.getItem("decodedToken");
    
                navigate("/");
                setLoading(false);
                toast.success('Successfully Login');
    
                if (tokenData) {
                    const parsedUserData: UserData = JSON.parse(tokenData);

                    const fullUserData = await findUserByEmail(email);

                    sessionStorage.setItem("fullUserData", JSON.stringify(fullUserData));
                    sessionStorage.setItem('userId', fullUserData.id);

                    try {
                        const cartCountResponse = await getCartsByUserId(fullUserData.id || '');
                        const updatedCartCount = cartCountResponse.length;
                        console.log("Updated Cart Count...", updatedCartCount);
    
                        setCartCount(updatedCartCount);
                    } catch (cartError) {
                        console.error('Error fetching cart count:', cartError);
                    }


                    
                    // Provide an empty string if sessionStorage.getItem("email") returns null

                }

                
               const notificationCount = await GetOpenNotificationCount();

               console.log("Notification Count.." , notificationCount)

               if (role === 'seller' && notificationCount !== undefined && notificationCount > 0) {

                handleAlert();

               }
                
            } else {
                setLoading(false);
                toast.error('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setLoading(false);
            toast.error('An error occurred during login. Please try again.');
        }
    };

    return (
        <div>
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
                            <button className="sub-btn" type="submit" disabled={loading}>
                                {loading ? (
                                    <div className='loader'>
                                        <span>Loading...</span>
                                        <div className="spinner" />
                                    </div>
                                ) : 'Login'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default Login;
