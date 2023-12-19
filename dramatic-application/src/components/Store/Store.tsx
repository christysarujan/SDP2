import React, { useEffect, useState } from 'react';
import StoreCreation from './StoreCreation/StoreCreation';
import './Store.scss';
import { findStoreByEmail } from '../../services/apiService';
import MyStore from './MyStore/MyStore';
import { Outlet } from 'react-router-dom';

const Store = () => {
    const [accountStatus, setAccountStatus] = useState(false);
    const [reviewStatus, setReviewStatus] = useState(false);

    const getStoreData = async () => {
        const email = sessionStorage.getItem('email');
        // const email = 'mgrwijethilaka@gmail.com';

        if (email) {
            try {
                const storeData = await findStoreByEmail(email);
                console.log('Store Data:', storeData);

                if (storeData.storeStatus === 'PENDING') {
                    setAccountStatus(false);
                    setReviewStatus(true);
                    // console.log('acc not veri');
                } else if (storeData.storeStatus === 'VERIFIED') {
                    // console.log('summa summa');
                    setAccountStatus(true);
                    setReviewStatus(false);
                } else {
                    setAccountStatus(false);
                    setReviewStatus(false);
                    console.log('Do not Have account');
                }
            } catch (error) {
                console.error('Error fetching store data:', error);
            }
        } else {
            console.warn('Email not found in sessionStorage');
        }
    };

    useEffect(() => {
        getStoreData();
    }, []);

    return (
        <div className='store-main'>
            {/*  */}
            {accountStatus ? (
             
                    <MyStore />
                   

            ) : (
                <>
                    {reviewStatus ? (
                        <>
                            <div className="store-review">
                                <div className="img"></div>
                                <p className="msg">Your request to create a store is under review</p>
                            </div>
                        </>
                    ) : (
                        <StoreCreation />
                    )}
                </>
            )}
            {/*  */}
        </div>
    );
};

export default Store;
