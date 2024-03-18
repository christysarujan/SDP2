import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { loginInitialValues, loginValidationSchema } from '../../../utils/Validation'
import { findUserByEmail, getCartsByUserId, userLogin } from '../../../services/apiService'
import { useNavigate } from 'react-router-dom'
import "../AuthForm.scss";
import "./Login.scss";
import { toast } from 'react-toastify'; 
import { jwtDecode } from "jwt-decode";
import { useCart } from '../../Cart/CartContext'

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
    const [loading, setLoading] = useState(false);
    const { setCartCount } = useCart();

    const loginSubmit = async (values: any) => {
        setLoading(true);
        try {
            const login = await userLogin(values);
    
            if (login && login.accessToken) {
                const accessToken = login.accessToken;
                const tokenDecode: any = jwtDecode(accessToken);
                const email = tokenDecode.email;
                const role = tokenDecode.role;
    
                console.log('Access Token :', accessToken);
                console.log('tokenDecode :', tokenDecode);
                sessionStorage.setItem('decodedToken', JSON.stringify(tokenDecode));
                sessionStorage.setItem('email', email);
                sessionStorage.setItem('role', role);
                sessionStorage.setItem('userData', JSON.stringify(login));
    
                const tokenData = sessionStorage.getItem("decodedToken");
    
                navigate("/")
                setLoading(false);
                toast.success('Successfully Login');
    
                if (tokenData) {
                    const parsedUserData: UserData = JSON.parse(tokenData);

                    const fullUserData = await findUserByEmail(email);

                   // sessionStorage.setItem('fullUserData', fullUserData);
                    // Store user details in sessionStorage
                   sessionStorage.setItem("fullUserData", JSON.stringify(fullUserData));

                    
                    sessionStorage.setItem('userId', fullUserData.id);
                    // Fetch cart count from the API after successful login

                    console.log("User Id : " , sessionStorage.getItem("userId"))
                    try {
                        const cartCountResponse = await getCartsByUserId(fullUserData.id || '');
                        const updatedCartCount = cartCountResponse.length;
                        console.log("Updated Card Count...", updatedCartCount);
    
                        // Update cart count in CartContext
                        setCartCount(updatedCartCount);
                    } catch (cartError) {
                        console.error('Error fetching cart count:', cartError);
                        // Handle cart count error here
                    }
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
    }
    


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
                            <button className="sub-btn" type="submit" disabled={loading}> {loading ? (<div className='loader'>
                                <span>Loading...</span>
                                <div className="spinner" />
                            </div>) : 'Login'}</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default Login
