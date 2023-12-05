import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useState } from 'react'

import { forgetPwdInitialValues, forgetPwdValidationSchema, resetPwdInitialValues, resetPwdValidationSchema } from '../../../utils/Validation'
import { getResetCode, pwdResetCode } from '../../../services/apiService'

const ResetPassword = () => {

    const [resetMsg, setResetMsg] = useState('')
    const [resetEmail, setResetEmail] = useState('')
    const [disableInput, setDisableInput] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingReset, setLoadingReset] = useState(false);

    const forgetPasswordSubmit = async (values: any) => {
        setLoading(true)
        const reset = await getResetCode(values);
        setResetMsg(reset);
        setResetEmail(values.email)
        // setDisableInput(reset === null || reset === '');
        if (reset) {
            setLoading(false)
            setDisableInput(false)
        }else{
            setLoading(false)
            setDisableInput(true)
        }
    }

    const resetPasswordSubmit = async (values: any) => {
        setLoadingReset(true)
        const formData = new FormData();

        formData.append('email', resetEmail);
        formData.append('code', values.code);
        formData.append('newPassword', values.password);

        const pwdReset = await pwdResetCode(formData)
        if (pwdReset) {
            setLoadingReset(false)
        }else{
            setLoadingReset(false)
        }
        console.log('pwdReset', pwdReset);
    }
    return (
        <div>
            <h6 className="forget-pwd-header">Forget Password</h6>
            <Formik
                initialValues={forgetPwdInitialValues}
                validationSchema={forgetPwdValidationSchema}
                onSubmit={forgetPasswordSubmit}
            >
                {({ values, handleChange, handleBlur, touched, errors }) => (
                    <Form>
                        <div className="forgetPwd-felid">
                            <div className="field-container felid">
                                <Field
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder='Email'
                                />
                                <ErrorMessage name="email" component="div" className="error" />
                            </div>

                            <div className="field-container felid-btn">
                                <button className="sub-btn" type="submit" disabled={loading}> {loading ? (<div className='loader'>
                                    {/* <span></span> */}
                                    <div className="spinner" />
                                </div>) : 'Send'}</button>
                            </div>
                            {/* 
                              <button className="sub-btn" type="submit" disabled={loading}> {loading ? (<div className='loader'>
                                <span>Loading...</span>
                                <div className="spinner" />
                            </div>) : 'Login'}</button>
                             */}
                        </div>
                    </Form>
                )}
            </Formik>
            <p className="reset-success">{resetMsg}</p>
            {/* <p className="reset-success">{resetEmail}</p> */}
            {/* reset password form */}
            <Formik
                initialValues={resetPwdInitialValues}
                validationSchema={resetPwdValidationSchema}
                onSubmit={resetPasswordSubmit}
            >
                {({ values, handleChange, handleBlur, touched, errors }) => (
                    <Form>

                        <div className="field-container felid">
                            <Field
                                type="text"
                                id="code"
                                name="code"
                                placeholder='Reset Code'
                                disabled={disableInput}
                            />
                            <ErrorMessage name="code" component="div" className="error" />
                        </div>
                        <div className="field-container felid">
                            <Field
                                type="password"
                                id="password"
                                name="password"
                                placeholder='New Password'
                                disabled={disableInput}
                            />
                            <ErrorMessage name="password" component="div" className="error" />
                        </div>
                        <div className="field-container felid">
                            <Field
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder='Confirm password'
                                disabled={disableInput}
                            />
                            <ErrorMessage name="confirmPassword" component="div" className="error" />
                        </div>

                        <div className="field-container felid-btn">
                            <button className="sub-btn" type="submit" disabled={loadingReset}> {loadingReset ? (<div className='loader'>
                                    <span>Resetting...</span>
                                    <div className="spinner" />
                                </div>) : 'Reset Password'}</button>
                        </div>


                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ResetPassword
