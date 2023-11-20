import React from 'react'
import './NavBar.scss'

const NavBar = () => {
  return (
    <div className="nav-bar-main">
      <div className="nav-item">
        <ul>
          <li>Men</li>
          <li>Women</li>
          <li>Kid</li>
        </ul>
      </div>
      <div className="nav-logo">Logo</div>
      <div className="nav-icons">
        <div className="icons">
          <i className="bi bi-search"></i>
          <i className="bi bi-person"></i>
          <i className="bi bi-bell"></i>
        </div>

      </div>
    </div>
  )
}

export default NavBar