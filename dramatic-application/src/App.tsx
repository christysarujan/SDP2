import React from 'react';
import './App.scss';
import NavBar from './components/NavBar/NavBar';
import LandingPage from './components/LandingPage/LandingPage';
import AuthForm from './components/AuthForm/AuthForm';
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from './components/Layout/Layout';
import Footer from './components/Footer/Footer';
import VerifyEmail from './components/VerifyEmail/VerifyEmail';
import UserProfile from './components/UserProfile/UserProfile';
import MyStore from './components/Store/MyStore/MyStore';
import Store from './components/Store/Store';
import ProductList from './components/Store/ProductList/ProductList';
import SellerProductList from './components/SellerProductList/SellerProductList';
import SellerPaymentDetails from './components/SellerPaymentDetails/SellerPaymentDetails';
import UserAddressManagement from './components/UserAddressManagement/UserAddressManagament';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/auth',
        element: <AuthForm />
      },
      {
        path: '/verifyEmail',
        element: <VerifyEmail />,
      },
      {
        path: '/userProfile',
        element: <UserProfile />,
        children: [
          {
            path: 'store', // Use a relative path here
            element: <Store />
          },
          {
            path: 'productList', // Use a relative path here
            element: <SellerProductList />
          },
          {
            path: 'paymentInfo', // Use a relative path here
            element: <SellerPaymentDetails />
          },
          {
            path: 'addressManagement', // Use a relative path here
            element: <UserAddressManagement />
          }
        ]
      },
    ]
  }
]);


function App() {
  return (
    <div className="app-main">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
