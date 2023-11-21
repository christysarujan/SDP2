// LandingPage.jsx
import React, { useState } from 'react';
import './LandingPage.scss';
// import myImage from '../../assests/images/Header-bg.png';

const LandingPage = () => {

    const cloths = ["T - Shirt", "Frocks", "Denims", "Other", "Shorts", "Sarees"]
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
    const colors = ["Red", "Green", "Yellow", "Black", "White", "Gray"]

    const [clickCount, setClickCount] = useState(0); /* Create a use state */
    const [selectedValues, setSelectedValues] = useState(['']);



    const clickHandle = (value: any) => {
        setClickCount((pre) => pre + 1); /* set value to useState variable */
        console.log(clickCount);
        setSelectedValues([...selectedValues, value]);

        if(clickCount === 2){
            setClickCount(0);
        }
        /* if(clickCount >= 2){
            setSelectedValues([])
        } */
    };
    console.log("Selected values...", selectedValues)

    return (
        <div className="landing-page-main">
            <div className="left">
                <div className="circle-container">
                    <div className="circle-2">
                        <img src="https://media.licdn.com/dms/image/C4D03AQE8TbpJ2VnRgA/profile-displayphoto-shrink_800_800/0/1652953157938?e=1706140800&v=beta&t=m7faBrjSUWFtJQdFDbNilQ9IlRtJk2gk8ezFYm7oepc" alt="Your Image" className="circle-image" />
                    </div>
                    {/* <div className="border-text">dfvdsfvdfdbbdb</div> */}
                </div>
            </div>
            <div className="right">
                {/* <div className="pie-chart"></div> */}
                {clickCount <= 2 &&
                    <>
                        <div className="circle"></div>
                        <div className="circle2"></div>
                        <div className="msg">
                            <span className='msg-span'>Let's &nbsp; <span style={{ color: '#D5A589' }}>Find</span></span>
                            <span className='msg-span'>What you</span>
                            <span className='msg-span' style={{ color: '#D5A589' }}>Want</span>
                        </div> 
                        </>}
                <div className="chart-main">
                    {clickCount === 0 && <div className="hexagon-container">

                        <div className={`ball ball${1}`} onClick={() => clickHandle(cloths[0])}><p className='p-text'>{cloths[0]}</p></div>
                        <div className="ball ball2" onClick={() => clickHandle(cloths[1])}><p className='p-text'>{cloths[1]}</p></div>
                        <div className="ball ball3" onClick={() => clickHandle(cloths[2])}><p className='p-text'>{cloths[2]}</p></div>
                        <div className="ball ball4" onClick={() => clickHandle(cloths[3])}><p className='p-text'>{cloths[3]}</p></div>
                        <div className="ball ball5" onClick={() => clickHandle(cloths[4])}><p className='p-text'>{cloths[4]}</p></div>
                        <div className="ball ball6" onClick={() => clickHandle(cloths[5])}><p className='p-text'>{cloths[5]}</p></div>
                    </div>}
                    {clickCount === 1 && <div className="hexagon-container">
                        <div className="ball ball1" onClick={() => clickHandle(sizes[0])}><p className='p-text'>{sizes[0]}</p></div>
                        <div className="ball ball2" onClick={() => clickHandle(sizes[1])}><p className='p-text'>{sizes[1]}</p></div>
                        <div className="ball ball3" onClick={() => clickHandle(sizes[2])}><p className='p-text'>{sizes[2]}</p></div>
                        <div className="ball ball4" onClick={() => clickHandle(sizes[3])}><p className='p-text'>{sizes[3]}</p></div>
                        <div className="ball ball5" onClick={() => clickHandle(sizes[4])}><p className='p-text'>{sizes[4]}</p></div>
                        <div className="ball ball6" onClick={() => clickHandle(sizes[5])}><p className='p-text'>{sizes[5]}</p></div>
                    </div>}
                    {clickCount === 2 && <div className="hexagon-container">
                        <div className="ball ball1" onClick={() => clickHandle(colors[0])}><p className='p-text'>{colors[0]}</p></div>
                        <div className="ball ball2" onClick={() => clickHandle(colors[1])}><p className='p-text'>{colors[1]}</p></div>
                        <div className="ball ball3" onClick={() => clickHandle(colors[2])}><p className='p-text'>{colors[2]}</p></div>
                        <div className="ball ball4" onClick={() => clickHandle(colors[3])}><p className='p-text'>{colors[3]}</p></div>
                        <div className="ball ball5" onClick={() => clickHandle(colors[4])}><p className='p-text'>{colors[4]}</p></div>
                        <div className="ball ball6" onClick={() => clickHandle(colors[5])}><p className='p-text'>{colors[5]}</p></div>
                    </div>}


                </div>
            </div>

        </div>
    );
}

export default LandingPage;
