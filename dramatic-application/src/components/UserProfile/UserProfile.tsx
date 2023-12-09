import React, { useEffect, useState } from 'react'
import './UserProfile.scss'
import { findUserByEmail } from '../../services/apiService'

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

const UserProfile = () => {


    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const tokenData = sessionStorage.getItem('decodedToken');

        if (tokenData) {
            const parsedUserData: UserData = JSON.parse(tokenData);
            console.log('sasas', parsedUserData);
            setUserData(parsedUserData);
        }


    }, []);

    const name = 'aa';
    const getUserDataByEmail = async () => {
        try {
            const response = await findUserByEmail('mgrwijethilaka@gmail.com');
            console.log('getByEmail', response);
      
            // Accessing the firstName property
            const firstName = response?.firstName;
            console.log('First Name:', firstName);
      
            // Now you can use the firstName in your React component's state or JSX
          } catch (error) {
            console.error('Error:', error);
          }
    };
    return (
        <div className='user-profile-main'>
            <div className="user-profile-left">
               
                <div className="profile-img-container">
                    <div className="profile-img"></div>
                </div>

                {/* <p className="user-name">{userData?.username}</p> */}
                <p className="user-name">Gihan Wijethilaka</p>
                <button onClick={getUserDataByEmail}>test</button>
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
                    <p>User Name: mgrw</p>
                    <p>Email: mgrwijethilaka@gmail.com</p>
                    <p>Mobile No: 0775588760</p>
                </div>
                <button className="btn btn-outline-success">Edit Profile</button>
            </div>
            <div className="user-profile-right"></div>
        </div>
    )
}

export default UserProfile
