// LandingPage.jsx
import React, { useState } from 'react';
import './LandingPage.scss';

const LandingPage = () => {

    const cloths = ["T - Shirt", "Frocks", "Denims", "Other", "Shorts", "Sarees"]
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

    const [clickCount, setClickCount] = useState(0); /* Create a use state */
    const [selectedValues, setSelectedValues] = useState(['asa']);



    const clickHandle = (value: any) => {
        setClickCount((pre) => pre + 1); /* set value to useState variable */
        console.log(clickCount);
        setSelectedValues([...selectedValues, value]);
    };
    console.log("Selected values...", selectedValues)

    return (
        <div className="landing-page-main">
            <div className="left">
                <div className="circle-container">
                    <div className="circle-2">
                        <img src="https://tse4.mm.bing.net/th/id/OIP.syvnaLoh1OeZd5C2bzC-bgHaEo?rs=1&pid=ImgDetMain" alt="Your Image" className="circle-image" />
                    </div>
                    {/* <div className="border-text">dfvdsfvdfdbbdb</div> */}
                </div>
            </div>
            <div className="right">
                {/* <div className="pie-chart"></div> */}
                <div className="circle"></div>
                <div className="circle2"></div>
                <div className="msg">
                    <span className='msg-span'>Let's &nbsp; <span style={{ color: 'red' }}>Find</span></span>
                    <span className='msg-span'>What you</span>
                    <span className='msg-span'  style={{ color: 'red' }}>Want</span>
                </div>
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


                </div>
            </div>

        </div>
    );
}

export default LandingPage;
