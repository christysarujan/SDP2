import React, { ChangeEvent, useEffect, useState } from 'react'
import './MyStore.scss'
import { findStoreByEmail, getProfileImage, getStoreImage, sellerStoreEdit } from '../../../services/apiService';
import { Formik, Field, ErrorMessage } from 'formik';
import { Form } from 'react-router-dom';
import { sellerStoreEditFormInitialValues, sellerStoreEditValidationSchema, sellerStoreFormInitialValues, sellerStoreValidationSchema } from '../../../utils/Validation';

interface StoreData {
    storeId: string;
    sellerEmail: string;
    name: string;
    contactNo: string;
    category: string;
    address: string;
    country: string;
    storeLogo: string;
    storeStatus: string;
}

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

const MyStore = () => {
    const [storeData, setStoreData] = useState<StoreData | null>(null);
    const [storeImg, setStoreImg] = useState('');
    const [userData, setUserData] = useState<UserData | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [defaultPage, setDefaultPage] = useState(true);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        getStoreData();
    }, []);
    useEffect(() => {
        getStorePhoto();
    }, [storeData]);

    const getStoreData = async () => {
        const email = sessionStorage.getItem('email');
        const storeData = await findStoreByEmail(email);
        setStoreData(storeData);
        console.log('Store Data::', storeData);
    }

    const getStorePhoto = async () => {
        try {

            const imageData = await getStoreImage(storeData?.storeLogo);

            const blob = new Blob([imageData], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(blob);

            setStoreImg(prevState => imageUrl);

            // Move this inside the then block
            console.log('ImgUrl:', imageUrl);
        } catch (error) {
            console.error('Error fetching profile image:', error);
        }
    };

    const storeFormEditSubmit = async (values:any) => {
        console.log('Submitting form with values:', values);
    
        try {
            const email = sessionStorage.getItem('email');
            const formData = new FormData();
    
            if(email){
                formData.append('sellerEmail', email);
            }
          
            formData.append('name', values.name);
            formData.append('contactNo', values.contactNo);
            formData.append('category', values.category);
            formData.append('address', values.address);
            formData.append('country', values.country);

            if (selectedFile) {
                formData.append('storeLogo', selectedFile, selectedFile.name);
            }

            console.log('Form Data:', formData);
    
            const editStore = await sellerStoreEdit(formData);
            // console.log('Edit Store Response:', editStore);
    
            // Add more console logs or actions here
    
        } catch (error) {
            console.error('Error in storeFormEditSubmit:', error);
        }
    }
    


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

    const defaultPageToggle = () => {
        setDefaultPage((prev) => !prev);
    }


    return (
        <div>
            {defaultPage ? (<div className='my-store-main'>
                <div className="header">
                    <div className="img">
                        <div className="store-img" style={{ backgroundImage: `url(${storeImg})` }}></div>
                    </div>
                    <div className="header-content">
                        <h2>{storeData?.name}</h2>
                        <p>Since 2023</p>

                    </div>
                    <button className='btn btn-success' onClick={defaultPageToggle}>Edit Store</button>

                </div>
                <hr />
                <div className="store-content">
                    <div className="content">
                        <p className='content-name'>Category </p>
                        <p className='content-data'>: {storeData?.category}</p>
                    </div>
                    <div className="content">
                        <p className='content-name'>Contact Number </p>
                        <p className='content-data'>: {storeData?.contactNo}</p>
                    </div>
                    <div className="content">
                        <p className='content-name'>Email </p>
                        <p className='content-data'>: {storeData?.sellerEmail}</p>
                    </div>
                    <div className="content">
                        <p className='content-name'>Address </p>
                        <p className='content-data'>: {storeData?.address}</p>
                    </div>
                    <div className="content">
                        <p className='content-name'>Country </p>
                        <p className='content-data'>: {storeData?.country}</p>
                    </div>
                </div>
            </div>) : (<div className='store-main'>
                <div className="header">
                    <p>Update Store Details</p>
                    <hr />
                </div>
                <div className="store-form">
                    <Formik
                        initialValues={sellerStoreEditFormInitialValues}
                        validationSchema={sellerStoreEditValidationSchema}
                        onSubmit={storeFormEditSubmit}
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
                                        <button className="btn btn-success" type="submit"  onClick={() => {
                                            storeFormEditSubmit(values)
                                        }}  disabled={loading}>
                                            {loading ? (
                                                <div className='loader'>
                                                    <span>Loading...</span>
                                                    <div className="spinner" />
                                                </div>
                                            ) : 'Submit'}
                                        </button>
{/* onClick={() => {
                                            storeFormEditSubmit(values)
                                        }} */}
                                    </div>

                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>)}
        </div>
        /*   */

    )
}

export default MyStore
