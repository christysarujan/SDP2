import React, { useEffect, useState } from 'react'
import './MyStore.scss'
import { findStoreByEmail } from '../../../services/apiService';

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

const MyStore = () => {
    const [storeData, setStoreData] = useState<StoreData | null>(null);

    useEffect(() => {
        getStoreData();
      }, []);
    
      const getStoreData = async () => {
        const email = sessionStorage.getItem('email');
        const storeData = await findStoreByEmail(email);
        setStoreData(storeData);
        console.log('Store Data::', storeData);
      }
    

    return (
        <div className='my-store-main'>
            <div className="header">
                <div className="img">
                <div className="store-img"></div>
                </div>
                <div className="header-content">
                    <h2>{storeData?.name}</h2>
                    <p>Since 2023</p>

                </div>
                <button className='btn btn-success'>Edit Store</button>
                
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
    )
}

export default MyStore
