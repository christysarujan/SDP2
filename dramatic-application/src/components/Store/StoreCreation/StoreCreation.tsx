import React, { ChangeEvent, useEffect, useState } from 'react'
import './StoreCreation.scss'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { sellerStoreFormInitialValues, sellerStoreValidationSchema } from '../../../utils/Validation'
import { sellerStoreRegistration } from '../../../services/apiService';

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

const StoreCreation = () => {
    const [loading, setLoading] = useState(false);
    const [defaultPage, setDefaultPage] = useState(true);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const tokenData = sessionStorage.getItem('decodedToken');

        if (tokenData) {
            const parsedUserData: UserData = JSON.parse(tokenData);
            setUserData(parsedUserData);
        }
    }, []);



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
    const storeFormSubmit = async (values: any) => {
        try {
            console.log('storeFormSubmit', values);

            const formData = new FormData();

            if (userData?.email) {
                formData.append('sellerEmail', userData?.email);
            }

            formData.append('name', values.name);
            formData.append('category', values.category);
            formData.append('address', values.address);
            formData.append('country', values.country);
            formData.append('contactNo', values.contactNo);

            if (selectedFile) {
                formData.append('storeLogo', selectedFile, selectedFile.name);
            }

            const storeCreate = await sellerStoreRegistration(formData);

        } catch (error) {
            console.log(error);
        }
    }

    const defaultPageToggle = () => {
        setDefaultPage((prev) => !prev);
    }

    return (
        <div className="store">
            {defaultPage ? (
            <div className="store-default">
                <div className="img"></div>
                <p className="msg">It seems like you didn't create a store yet.</p>
                <button className='create-btn' onClick={defaultPageToggle}>Create New</button>
            </div>) : (
                <div className='store-main'>
                <div className="header">
                    <p>Create New Store</p>
                    <hr />
                </div>
                <div className="store-form">
                    <Formik
                        initialValues={sellerStoreFormInitialValues}
                        validationSchema={sellerStoreValidationSchema}
                        onSubmit={storeFormSubmit}
                    >
                        {({ values, handleChange, handleBlur, touched, errors }) => (
                            <Form>
                                <div className="field-container">
                                    <div className="field-input">
                                        <label>Store Name :</label>
                                        <Field
                                            type="text"
                                            id="name"
                                            name="name"
                                        />
                                    </div>
    
                                    <ErrorMessage name="name" component="div" className="error" />
                                </div>
                                <div className="field-container">
                                    <div className="field-input">
                                        <label>Category :</label>
                                        <Field
                                            type="text"
                                            id="category"
                                            name="category"
                                        />
                                    </div>
                                    <ErrorMessage name="category" component="div" className="error" />
                                </div>
                                <div className="field-container">
                                    <div className="field-input">
                                        <label>Address :</label>
                                        <Field
                                            type="text"
                                            id="address"
                                            name="address"
                                        />
                                    </div>
                                    <ErrorMessage name="address" component="div" className="error" />
                                </div>
                                <div className="field-container">
                                    <div className="field-input">
                                        <label>Country :</label>
                                        <Field
                                            type="text"
                                            id="country"
                                            name="country"
                                        />
                                    </div>
                                    <ErrorMessage name="country" component="div" className="error" />
                                </div>
                                <div className="field-container">
                                    <div className="field-input">
                                        <label>Contact Number :</label>
                                        <Field
                                            type="text"
                                            id="contactNo"
                                            name="contactNo"
                                        />
                                    </div>
                                    <ErrorMessage name="contactNo" component="div" className="error" />
                                </div>
                                <div className="field-container">
                                    <div className="file-input-container">
                                        <label className='file-label'>
                                            Logo :
                                        </label>
                                        <div className="name">
                                            <label htmlFor="fileInput" className="file-input-label">
                                                <span className="button">Choose Image</span>
                                                <input
                                                    type="file"
                                                    accept="image/*" // Allow only image files
                                                    id="fileInput"
                                                    className="file-input"
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                            <div className="fileName">
                                                {selectedFile && (
                                                    <div>
                                                        <span className="file-name">{selectedFile.name}</span>
                                                    </div>
                                                )}
                                            </div>
    
                                        </div>
                                    </div>
                                </div>
                                <div className="field-container">
                                    <div className="preview-main">
                                        <div className="preview">
                                            {selectedFile && (
                                                <div>
                                                    <div>
                                                        {imageSrc && <img src={imageSrc} alt="Selected" />}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
    
                                <div className="field-container">
                                    <div className="buttons">
                                        <button className='btn btn-secondary' onClick={defaultPageToggle}>Close</button>
                                        <button className="btn btn-success" type="submit" disabled={loading}> {loading ? (<div className='loader'>
                                            <span>Loading...</span>
                                            <div className="spinner" />
                                        </div>) : 'Submit'}</button>
                                    </div>
    
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            )}
        </div>
    )
}

export default StoreCreation
