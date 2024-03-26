import React, { useState } from 'react'
import NavBar from '../NavBar/NavBar'
import { Outlet, RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom'
import Footer from '../Footer/Footer'
import { ToastContainer } from 'react-toastify';
import NavBarVisible from '../NavBar/NavBarVisible/NavBarVisible';
import FooterVisible from '../Footer/FooterVisible/FooterVisible';

const Layout = () => {
   
  return (
    <div>
      <NavBarVisible>
        <NavBar  />
      </NavBarVisible>

      <Outlet  />
      <ToastContainer autoClose={3000} position="top-right" theme="colored" />
      <FooterVisible>
        <Footer />
      </FooterVisible>

    </div>
  )
}

export default Layout
