import React from 'react';
import './App.scss';
import NavBar from './components/NavBar/NavBar';
import LandingPage from './components/LandingPage/LandingPage';
import AuthForm from './components/AuthForm/AuthForm';

function App() {
  return (
    <div className="app-main">
      <NavBar/>
      {/* <LandingPage/> */}
      <AuthForm/>
    </div>
  );
}

export default App;
