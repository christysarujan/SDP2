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
      },
    ] 
  },

]);
function App() {
  return (
    <div className="app-main">
        <RouterProvider router={router} />
    </div>
  );
}

export default App;
