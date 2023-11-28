import React from 'react'
import NavBar from '../NavBar/NavBar'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Footer from '../Footer/Footer'

const Layout = () => {
  

  return (
    <div>
      <NavBar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default Layout
