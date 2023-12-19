import React from 'react'
import './NavBar.scss'
// import {logo} from '../../assests/images/logo.png'
import { Link, NavLink, useNavigate } from 'react-router-dom'

interface DecodedToken {
  sub: string;
  role: string;
  verificationStatus: string;
  iss: string;
  exp: number;
  iat: number;
  email: string;
  username: string;
}

const NavBar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.removeItem('decodedToken');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('email');
    navigate("/")
  };

  const decodedToken = sessionStorage.getItem('decodedToken');
  // console.log('sas', decodedToken);

 /*  const profileNavigation = () => {
    if(decodedToken && decodedToken.verificationStatus === 'VERIFIED'){
      navigate("/")
    }else{
      navigate("/")
    } */

    const checkVerificationStatus = () => {
      // Retrieve the decodedToken from sessionStorage
      const decodedTokenString = sessionStorage.getItem('decodedToken');
      const role = sessionStorage.getItem('role');
  
      if (decodedTokenString) {
        const decodedToken: DecodedToken = JSON.parse(decodedTokenString);
  
        // Check if verificationStatus is VERIFIED
        if (decodedToken && decodedToken.verificationStatus === 'VERIFIED') {
          // Navigate to the profile page
          if(role === 'seller'){
            navigate("/profile/store")
          } else if (role === 'user'){
            navigate("/profile/addressManagement")
          }
        } else {
          // Navigate to the email verification pageverifyEmail
          navigate("/verifyEmail")
        }
      } else {
        // Handle the case where decodedToken is not found in sessionStorage
        console.error('Decoded token not found in sessionStorage');
      }
    };
   
  

  return (
    <div className="nav-bar-main">
      <div className="nav-item">
        <ul>
          <li>Men</li>
          <li>Women</li>
          <li>Kid</li>
        </ul>
      </div>
      <div className="nav-logo">
        <img src="../../assests/images/logo.png" alt="" />
      </div>
      <div className="nav-icons">
        <div className="icons">
          <i className="bi bi-search"></i>
          <i className="bi bi-person" onClick={checkVerificationStatus}></i>
          <i className="bi bi-bell"></i>
          {/* <NavLink to={"/auth"}><button className='btn btn-outline-secondary'>Login</button></NavLink> */}
          <div>
            {decodedToken ? (
              // If decodedToken exists, render Logout button
              <button className='btn btn-outline-secondary' onClick={handleLogout}>
                Logout
              </button>
            ) : (
              // If decodedToken is empty, render Login button with NavLink to '/auth'
              <NavLink to="/auth">
                <button className='btn btn-outline-secondary'>Login</button>
              </NavLink>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default NavBar