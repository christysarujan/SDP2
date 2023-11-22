import React from 'react';
import './App.scss';
import NavBar from './components/NavBar/NavBar';
import LandingPage from './components/LandingPage/LandingPage';
import AuthForm from './components/AuthForm/AuthForm';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div className="app-main">
      <NavBar/>
      <LandingPage/>
      <Footer/>
      {/* <AuthForm/> */}
    </div>
  );
}

export default App;
