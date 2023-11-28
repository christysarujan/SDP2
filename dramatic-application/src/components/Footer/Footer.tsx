import React from 'react'
import { Facebook } from 'react-bootstrap-icons';
import { Instagram } from 'react-bootstrap-icons';
import { Whatsapp } from 'react-bootstrap-icons';
import { Google } from 'react-bootstrap-icons';

import './footer.scss';

function Footer() {
  return (
    <div>
        <div className="section-5">
        <div className="footer">

        <div className="row">
  <div className="col-sm-3">
      BE IN TOUCH WITH US
  </div>
  <div className="col-sm-6">
  <input type="text" value="" placeholder="Enter your Email" className="txtbox" />
     <input type="submit" value=" Join Us "  className="btncls" />
  </div>
  
  <div className="col-sm-3">
  <Facebook className='social-icons' />
  <Instagram className='social-icons'/>
  <Whatsapp className='social-icons'/>
  <Google className='social-icons'/>

  </div>
</div>
        </div>
       
        </div>
        <div className="footer-links">
        <div className="row">
        <div className="col-md-3">
          <h5>Services</h5>

          <p>Shoping and Return</p>
          <p>Privacy & Policy</p>
          <p>Terms & Conditions</p>
            </div>
        <div className="col-md-3">
              <h5> Information</h5>

            <p>About Us</p>
            <p>Contact</p>
        </div>
        <div className="col-md-3">
        <h5> Get in touch</h5>

        <p>online@thead.com</p>
          <p>+94 7745 44 45</p>
        </div>
        <div className="col-md-3 allright" >
        <h5> ALL RIGHT RESERVED 2023</h5>
        </div>
        </div>
        </div>
    </div>
  )
}

export default Footer