import React, { useEffect, useState } from 'react'
import './UserProfile.scss'
import { findUserByEmail } from '../../services/apiService'
import StoreCreation from '../StoreCreation/StoreCreation';

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
}
const UserProfile = () => {


    const [userData, setUserData] = useState<UserData | null>(null);
    const [profileData, setProfileData] = useState<ProfileData | null>({
        firstName: 'null',
        lastName: 'null',
        role: 'null',
        username: 'null',
        email: 'null',
    });
    useEffect(() => {
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
            console.log('res',response);
            const { firstName, lastName, role, username, email } = response;
            setProfileData({ firstName, lastName, role, username, email });
        } catch (error) {
            // console.error('Error in getUserDataByEmail:', error);
        }
    };

    return (
        <div className='user-profile-main'>
            <div className="user-profile-left">

                <div className="profile-img-container">
                    <div className="profile-img"></div>
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
                <StoreCreation/>
            </div>
        </div>
    )
}

export default UserProfile
