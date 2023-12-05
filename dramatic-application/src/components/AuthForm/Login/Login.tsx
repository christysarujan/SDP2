import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useState } from 'react'
import { loginInitialValues, loginValidationSchema } from '../../../utils/Validation'
import { userLogin } from '../../../services/apiService'
import { useNavigate } from 'react-router-dom'
import "../AuthForm.scss";
import "./Login.scss";
import { toast } from 'react-toastify';

const Login = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const loginSubmit = async (values: any) => {
        setLoading(true);
        console.log(values);
        const login = await userLogin(values);

        if (login) {
            console.log(login);
            navigate("/")
            setLoading(false);
            toast.success('Successfully Login');
        } else {
            setLoading(false);
            toast.error('Login failed. Please try again.');
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
