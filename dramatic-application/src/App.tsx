import React from 'react';
import './App.scss';
import NavBar from './components/NavBar/NavBar';
import LandingPage from './components/LandingPage/LandingPage';

function App() {
  return (
    <div className="app-main">
      <NavBar/>
      <LandingPage/>
    </div>
  );
}

export default App;
