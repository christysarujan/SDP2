import React, { useState } from 'react';
import './NavBar.scss';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../Cart/CartContext';
import { getAllNotificationsBySellerEmail, searchByQuery } from '../../services/apiService';

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
    sessionStorage.clear();
    const cartCount = 0;
    navigate("/");
    window.location.reload();
  };

  const [showHideSearchBar, setShowHideSearchBar] = useState<boolean>(false);

  const decodedTokenString = sessionStorage.getItem('decodedToken');
  const decodedToken: DecodedToken | null = decodedTokenString ? JSON.parse(decodedTokenString) : null;

  const checkVerificationStatus = () => {
    const role = sessionStorage.getItem('role');

    if (decodedToken && decodedToken.verificationStatus === 'VERIFIED') {
      if (role === 'seller') {
        navigate("/store")
      } else if (role === 'user') {
        navigate("/addressManagement")
      } else if (role === 'admin') {
        navigate("/storeInfo")
      }
    } else {
      navigate("/verifyEmail")
    }
  };

  const [searchValue, setSearchValue]= useState<string>("")

  const handleSearchinput = (ev:React.ChangeEvent<HTMLInputElement>)=>{
    setSearchValue(ev.target.value);
    
  }

  const handlesearch = () => {
    setShowHideSearchBar(!showHideSearchBar);

  }

  const clickSearchHandler =async()=> {
    setShowHideSearchBar(false);
    // searchCalled(searchValue)
    navigate(`/search/${searchValue}`);
   
  }

  const handleNotificationClick = async () => {
    if (decodedToken && decodedToken.role === 'seller') {
      try {
        const notifications = await getAllNotificationsBySellerEmail(decodedToken.email);
        console.log('Notifications:', notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
  };

  return (
    <div className="nav-bar-main">
      <div className="nav-item">
        <ul>
          {decodedToken && decodedToken.role === 'user' && (
            <>
              <li><Link to="/mensItems">Men</Link></li>
              <li><Link to="/womenItems">Women</Link></li>
              <li><Link to="/kidsItems">Kids</Link></li>
            </>
          )}
        </ul>
      </div>
      <div className="nav-logo">
        <Link to="/">
          <div className="logo"></div>
        </Link>
      </div>
      <div className="nav-icons">
        <div className="icons">
          <NavLink to="/viewCart">
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <span className="cart-count" style={{ position: 'absolute', top: '-19px', right: '-10px', backgroundColor: 'red', color: 'white', borderRadius: '50%', padding: '5px 8px', fontSize: '12px', fontWeight: 'bold' }}>{cartCount}</span>
              <FontAwesomeIcon icon={faShoppingCart} className="bi bi-cart" style={{ color: 'black' }} />
            </div>
          </NavLink>
          <Link to="/viewWish" className="heart-link">
            <FontAwesomeIcon icon={faHeart} className="heart-icon" style={{ color: 'black' }} />
          </Link>
          <i className="bi bi-search" onClick={handlesearch}></i>

          <i className="bi bi-person" onClick={checkVerificationStatus}></i>
          <NavLink to="/notifications">
            <i className="bi bi-bell" onClick={handleNotificationClick}></i>
          </NavLink>
          <div>
            {decodedToken ? (
              <button className='btn btn-outline-secondary' onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <NavLink to="/auth">
                <button className='btn btn-outline-secondary'>Login</button>
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {showHideSearchBar && <div className='search-container'>
        <div className='search-bar-input-container'>
          <div className='search'>
            <form className="d-flex" role="search" >
              <input onChange={handleSearchinput} className="form-control" type="search" placeholder="Search" aria-label="Search" />
              <button onClick={clickSearchHandler} className="btn btn-outline-success" type="button">Search</button>
            </form>
          </div>
        </div>
      </div>}

    </div>
  );
}

export default NavBar;
