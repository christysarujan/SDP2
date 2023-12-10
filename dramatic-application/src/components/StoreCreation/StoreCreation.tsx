import React, { ChangeEvent, useState } from 'react'
import './StoreCreation.scss'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { sellerStoreFormInitialValues, sellerStoreValidationSchema } from '../../utils/Validation'

const StoreCreation = () => {
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

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

        } catch (error) {

        }
    }

    return (
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
                                        id="username"
                                        name="username"
                                    />
                                </div>

                                <ErrorMessage name="username" component="div" className="error" />
                            </div>
                            <div className="field-container">
                                <div className="field-input">
                                    <label>Category :</label>
                                    <Field
                                        type="text"
                                        id="username"
                                        name="username"
                                    />
                                </div>
                                <ErrorMessage name="username" component="div" className="error" />
                            </div>
                            <div className="field-container">
                                <div className="field-input">
                                    <label>Address :</label>
                                    <Field
                                        type="text"
                                        id="username"
                                        name="username"
                                    />
                                </div>
                                <ErrorMessage name="username" component="div" className="error" />
                            </div>
                            <div className="field-container">
                                <div className="field-input">
                                    <label>Country :</label>
                                    <Field
                                        type="text"
                                        id="username"
                                        name="username"
                                    />
                                </div>
                                <ErrorMessage name="username" component="div" className="error" />
                            </div>
                            <div className="field-container">
                                <div className="field-input">
                                    <label>Contact Number :</label>
                                    <Field
                                        type="text"
                                        id="username"
                                        name="username"
                                    />
                                </div>
                                <ErrorMessage name="username" component="div" className="error" />
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
                                    <button className='btn btn-secondary'>Close</button>
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
    )
}

export default StoreCreation
