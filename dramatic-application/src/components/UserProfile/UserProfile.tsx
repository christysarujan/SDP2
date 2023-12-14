import React, { useEffect, useState } from 'react'
import './UserProfile.scss'
import { findUserByEmail, getProfileImage } from '../../services/apiService'
import StoreCreation from '../Store/StoreCreation/StoreCreation';
import Store from '../Store/Store';
import { Outlet } from 'react-router';
import { NavLink } from 'react-router-dom';

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
interface ProfileData {
    firstName: string;
    lastName: string;
    role: string;
    username: string;
    email: string;
    profileImage: string;
}
const UserProfile = () => {

    const [profileImg, setProfileImg] = useState('');
    const [userData, setUserData] = useState<UserData | null>(null);
    const [profileData, setProfileData] = useState<ProfileData | null>({
        firstName: 'null',
        lastName: 'null',
        role: 'null',
        username: 'null',
        email: 'null',
        profileImage: 'null',

    });
    useEffect(() => {
        getProfilePhoto();
        const tokenData = sessionStorage.getItem('decodedToken');

        if (tokenData) {
            const parsedUserData: UserData = JSON.parse(tokenData);
            // console.log('sasas', parsedUserData);
            setUserData(parsedUserData);
        }
    }, []);

    useEffect(() => {
        getUserDataByEmail();
    }, [userData]);

    const getUserDataByEmail = async () => {
        try {
            const response = await findUserByEmail(userData?.email);
            // console.log('resss',response);
            const { firstName, lastName, role, username, email, profileImage } = response;
            setProfileData({ firstName, lastName, role, username, email, profileImage });
        } catch (error) {
            // console.error('Error in getUserDataByEmail:', error);
        }
    };


    const getProfilePhoto = async () => {
        try {
            const imageData = await getProfileImage('266ec336-d9a7-48bd-a93d-703742a94729.png');

            const blob = new Blob([imageData], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(blob);

            setProfileImg(prevState => imageUrl);

            // Move this inside the then block
            console.log('ImgUrl:', imageUrl);
        } catch (error) {
            console.error('Error fetching profile image:', error);
        }
    };

    /* useEffect(() => {
        // Log profileImg changes
        console.log('Updated:', profileImg);
    }, [profileImg]); */



    return (
        <div className='user-profile-main'>
            <div className="user-profile-left">
                {/* {profileImg && <img src={profileImg} alt="Profile" />} */}
                <div className="profile-img-container">
                    <div className="profile-img" style={{ backgroundImage: `url(${profileImg})` }}></div>
                </div>

                <p className="user-name">{profileData?.firstName} {profileData?.lastName}</p>
                {/* <button onClick={getUserDataByEmail}>test</button> */}
                <div className="profile-summery">
                    <div className="items">
                        <p>Item</p>
                        <p>-</p>
                    </div>
                    <div className="v-line"></div>
                    <div className="income">
                        <p>Income</p>
                        <p>-</p>
                    </div>
                    <div className="v-line"></div>
                    <div className="date">
                        <p>Member Since</p>
                        <p>-</p>
                    </div>
                </div>
                <div className="profile-details">
                    <p>User Name: {profileData?.username}</p>
                    <p>Email: {profileData?.email}</p>
                    <p>Mobile No: 0775588760</p>
                </div>
                <button className="btn btn-outline-success">Edit Profile</button>
            </div>
            <div className="user-profile-right">
                {/* <Store /> */}
                <div className="main-content">
                    <div className="nav-bar">
                        <ul>
                            <NavLink to="store" className="nav-item" ><li>My Store</li>  </NavLink>
                            <NavLink to="productList" className="nav-item"><li>Product List</li>  </NavLink>
                            <NavLink to="paymentInfo" className="nav-item"><li>Payment Information</li>  </NavLink>
                            <NavLink to="paymentInfo" className="nav-item"><li>Order Details</li>  </NavLink>
                            <NavLink to="addressManagement" className="nav-item"><li>Billing and Shipping Address</li>  </NavLink>
                         
                        </ul>
                    </div>
                    {/* <Outlet /> */}
                </div>
                <Outlet />
            </div>
        </div>
    )
}

export default UserProfile;
