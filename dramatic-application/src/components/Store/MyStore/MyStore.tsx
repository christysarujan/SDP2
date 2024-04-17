import React, { ChangeEvent, useEffect, useState } from 'react';
import './MyStore.scss';
import { findStoreByEmail, getStoreImage, sellerStoreEdit } from '../../../services/apiService';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import { sellerStoreEditValidationSchema } from '../../../utils/Validation';

interface StoreData {
  storeId: string;
  sellerEmail: string;
  name: string;
  contactNo: string;
  category: string;
  address: string;
  country: string;
  storeLogo: string;
}

const MyStore = () => {
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [storeImg, setStoreImg] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [defaultPage, setDefaultPage] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getStoreData();
  }, []);

  useEffect(() => {
    if (storeData?.storeLogo) {
      getStorePhoto(storeData.storeLogo);
    }
  }, [storeData]);

  const getStoreData = async () => {
    const email = sessionStorage.getItem('email');
    if (email) {
      const storeData = await findStoreByEmail(email);
      setStoreData(storeData);
    }
  };

  const getStorePhoto = async (storeLogo: string) => {
    try {
      const imageData = await getStoreImage(storeLogo);
      const blob = new Blob([imageData], { type: 'image/png' });
      const imageUrl = URL.createObjectURL(blob);
      setStoreImg(imageUrl);
    } catch (error) {
      console.error('Error fetching store image:', error);
    }
  };

  const storeFormEditSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('sellerEmail', sessionStorage.getItem('email') || '');
      formData.append('name', values.name);
      formData.append('contactNo', values.contactNo);
      formData.append('category', values.category);
      formData.append('address', values.address);
      formData.append('country', values.country);

      if (selectedFile) {
        formData.append('storeLogo', selectedFile);
      }

      const response = await sellerStoreEdit(formData);
      console.log('API Response:', response);
      await getStoreData();
      defaultPageToggle();
    } catch (error) {
      console.error('Error in storeFormEditSubmit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const defaultPageToggle = () => {
    setDefaultPage((prev) => !prev);
  };

  return (
    <div>
      {defaultPage ? (
        <div className='my-store-main'>
          <div className="header">
            <div className="img">
              <div className="store-img" style={{ backgroundImage: `url(${storeImg})` }}></div>
            </div>
            <div className="header-content">
              <h2>{storeData?.name}</h2>
              <p>Since 2023</p>
            </div>
            <button className='btn btn-success' onClick={defaultPageToggle}>Update Store</button>
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
        </div>
      ) : (
        <div className='store-main'>
          <div className="header">
            <p>Update Store Details</p>
            <hr />
          </div>
          <div className="store-form">
            <Formik
              initialValues={{
                name: storeData?.name || '',
                category: storeData?.category || '',
                address: storeData?.address || '',
                country: storeData?.country || '',
                contactNo: storeData?.contactNo || '',
              }}
              validationSchema={sellerStoreEditValidationSchema}
              onSubmit={storeFormEditSubmit}
            >
              {({ values, handleChange, handleBlur, touched, errors }) => (
                <Form>
                  <div className="field-container">
                    <div className="field-input">
                      <label>Store Name :</label>
                      <Field type="text" id="name" name="name" />
                    </div>
                    <ErrorMessage name="name" component="div" className="error" />
                  </div>
                  <div className="field-container">
                    <div className="field-input">
                      <label>Category :</label>
                      <Field type="text" id="category" name="category" />
                    </div>
                    <ErrorMessage name="category" component="div" className="error" />
                  </div>
                  <div className="field-container">
                    <div className="field-input">
                      <label>Contact Number :</label>
                      <Field type="text" id="contactNo" name="contactNo" />
                    </div>
                    <ErrorMessage name="contactNo" component="div" className="error" />
                  </div>
                  <div className="field-container">
                    <div className="field-input">
                      <label>Address :</label>
                      <Field type="text" id="address" name="address" />
                    </div>
                    <ErrorMessage name="address" component="div" className="error" />
                  </div>
                  <div className="field-container">
                    <div className="field-input">
                      <label>Country :</label>
                      <Field type="text" id="country" name="country" />
                    </div>
                    <ErrorMessage name="country" component="div" className="error" />
                  </div>
                  <div className="field-container">
                    <label>Upload Store Logo:</label>
                    <input type="file" onChange={handleFileChange} />
                    {imageSrc && <img src={imageSrc} alt="Store Logo" style={{ maxWidth: '100px', marginTop: '10px',marginLeft:'10px', marginBottom: '20px'}} />}
                  </div>
                  <div className="field-container">
                  <button type="submit" disabled={loading} className={loading ? 'btn btn-disabled' : 'btn btn-success'}>
                      {loading ? 'Loading...' : 'Submit'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyStore;
