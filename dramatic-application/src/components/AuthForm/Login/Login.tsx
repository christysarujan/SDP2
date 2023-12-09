import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { loginInitialValues, loginValidationSchema } from '../../../utils/Validation'
import { userLogin } from '../../../services/apiService'
import { useNavigate } from 'react-router-dom'
import "../AuthForm.scss";
import "./Login.scss";
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";

const Login = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const loginSubmit = async (values: any) => {
        setLoading(true);
        try {
            const login = await userLogin(values);

            if (login && login.accessToken) {
                const accessToken = login.accessToken;
                const tokenDecode = jwtDecode(accessToken);
                console.log('Access Token :', accessToken);
                sessionStorage.setItem('decodedToken', JSON.stringify(tokenDecode));
                sessionStorage.setItem('userData', JSON.stringify(login));

                navigate("/")
                setLoading(false);
                toast.success('Successfully Login');
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
