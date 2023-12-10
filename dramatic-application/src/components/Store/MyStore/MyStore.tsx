import React from 'react'
import './MyStore.scss'

const MyStore = () => {
    return (
        <div className='my-store-main'>
            <div className="header">
                <div className="img">
                <div className="store-img"></div>
                </div>
                <div className="header-content">
                    <h2>Faction Store</h2>
                    <p>Sine 2023</p>

                </div>
                <button className='btn btn-success'>Edit Store</button>
                
            </div>
            <hr />
            <div className="store-content">
                <div className="content">
                    <p className='content-name'>Category </p>
                    <p className='content-data'>: Footwear</p>
                </div>
                <div className="content">
                    <p className='content-name'>Contact Number </p>
                    <p className='content-data'>: 0775588760</p>
                </div>
                <div className="content">
                    <p className='content-name'>Email </p>
                    <p className='content-data'>: mgrwijethilaka@gmail.com</p>
                </div>
                <div className="content">
                    <p className='content-name'>Address </p>
                    <p className='content-data'>: Pallegama, Pepiliyawala</p>
                </div>
                <div className="content">
                    <p className='content-name'>Country </p>
                    <p className='content-data'>: Sri Lanka</p>
                </div>
            </div>
        </div>
    )
}

export default MyStore
