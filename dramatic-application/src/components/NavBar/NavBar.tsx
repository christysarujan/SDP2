import React from 'react'
import './NavBar.scss'
// import {logo} from '../../assests/images/logo.png'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../Cart/CartContext';

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
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const handleLogout = () => {
/*     sessionStorage.removeItem('decodedToken');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('email'); */
            sessionStorage.clear();
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
            navigate("/store")
          } else if (role === 'user'){
            navigate("/addressManagement")
          } else if (role === 'admin'){
            navigate("/storeInfo")
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
        <li><Link to="/mensItems">Men</Link></li>
        <li><Link to="/womenItems">Women</Link></li>
        <li><Link to="/kidsItems">Kids</Link></li>
        </ul>
      </div>
      <div className="nav-logo">
      <Link to="/"> {/* Add Link to the home page */}
        <div className="logo"></div>
      </Link>
      </div>
      <div className="nav-icons">
        <div className="icons">

          <NavLink to="/viewCart">
            <FontAwesomeIcon icon={faShoppingCart} className="bi bi-cart" style={{ color: 'black' }} />
            <span className="cart-count">{cartCount}</span>
          </NavLink>

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