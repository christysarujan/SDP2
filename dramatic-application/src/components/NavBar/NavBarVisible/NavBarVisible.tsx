import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

const NavBarVisible = ({children}:any) => {

    const location = useLocation();
    const [showNavBar, setShowNavBar] = useState(false);

    useEffect(() => {
        console.log('This is location', location);
        if(location.pathname === '/auth'){
            setShowNavBar(false)
        }else{
            setShowNavBar(true)
        }
    })
  return (
    <div>
      {showNavBar && children}
    </div>
  )
}

export default NavBarVisible
