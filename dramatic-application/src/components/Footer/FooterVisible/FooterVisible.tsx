import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

const FooterVisible = ({children}:any) => {
    const location = useLocation();
    const [showFooter, setShowFooter] = useState(false);

    useEffect(() => {
        // console.log('This is location', location);
        if(location.pathname === '/auth' || location.pathname === '/profile' || location.pathname === '/verifyEmail'){
            setShowFooter(false)
        }else{
            setShowFooter(true)
        }
    })

  return (
    <div>
      {showFooter && children}
    </div>
  )
}

export default FooterVisible
