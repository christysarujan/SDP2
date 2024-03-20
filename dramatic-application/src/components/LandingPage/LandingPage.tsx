// LandingPage.jsx
import React, { useState } from 'react';
import './LandingPage.scss';
import NavBar from '../NavBar/NavBar';
// import myImage from '../../assests/images/Header-bg.png';

// import { ArrowRight } from 'react-bootstrap-icons';
// import { BagCheck } from 'react-bootstrap-icons';

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

        if (clickCount === 2) {
            setClickCount(0);
        }
        /* if(clickCount >= 2){
            setSelectedValues([])
        } */
    };
    console.log("Selected values...", selectedValues)

    return (
        <div>
            <div className="landing-page-main">
                <div className="left">
                    <div className="circle-container">
                        <div className="circle-2">
                            <img src="https://i.pinimg.com/originals/8f/bd/3c/8fbd3c24d7e0a99929aa6c41ac946259.jpg" alt="Your Image" className="circle-image" />
                        </div>
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
            <div className="second-part">
                <div className='home-area'>
                    <div className="row">
                        <div className="col-md-3 offer">
                            <span className='title-bold'>What</span> do we <br></br> <span className='title-bold'>OFFER</span> you
                        </div>
                        <div className="col-md-3">
                            <h5 className='sub-title'>Rich Experience</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae sem at leo ultricies </p>
                            <p className='read'>Read more {/* <ArrowRight /> */}</p>
                        </div>
                        <div className="col-md-3">
                            <h5 className='sub-title'>Affordable prices</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae sem at leo ultricies </p>
                            <p className='read'>Read more {/* <ArrowRight /> */}</p>
                        </div>
                        <div className="col-md-3">
                            <h5 className='sub-title'>Many choices</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae sem at leo ultricies </p>
                            <p className='read'>Read more {/* <ArrowRight /> */}</p>
                        </div>
                    </div>
                </div>

                <div className="trending-area">
                    <div className="row">
                        <div className="col-sm-9"> <h2 className='heading-main' >TRENDING</h2></div>
                        <div className="col-sm-3"> <p className='selling-text'>Discover the latest trends</p></div>
                    </div>

                    <div className="photo-area">
                        <div className="row">
                            <div className="col mx-1 ">
                                <img className='sell-img' src='https://fbpros3v1.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2023/11/0304505162WHT-FRE-3Ladies-dress_fashion-bug_srilanka_compressed_compressed-300x382.jpg'></img>
                                <p className="img-des">Slick over tshirt</p>
                                {/*  <BagCheck className='e-bag'/> */}
                                <p className='price'>$12.66</p>


                            </div>
                            <div className="col lg-1 ">
                                <img className='sell-img' src='https://fbpros3v1.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2023/10/0304505153PNK-1_Ladies-skirt_fashion-bug_srilanka_compressed-300x382.jpg'></img>
                                <p className="img-des">Slick over tshirt</p>
                                {/*  <BagCheck className='e-bag'/> */}
                                <p className='price'>Rs 5,600 </p>
                            </div>
                            <div className="col lg-1 ">
                                <img className='sell-img' src='https://fbpros3v1.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2023/11/0304505162WHT-FRE-3Ladies-dress_fashion-bug_srilanka_compressed_compressed-300x382.jpg'></img>
                                <p className="img-des">Slick over tshirt</p>
                                {/*  <BagCheck className='e-bag'/> */}
                                <p className='price'>Rs 6,000</p>
                            </div>
                            <div className="col lg-1 ">
                                <img className='sell-img' src='https://fbpros3v1.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2023/10/0304505153PNK-1_Ladies-skirt_fashion-bug_srilanka_compressed-300x382.jpg'></img>
                                <p className="img-des">Slick over tshirt</p>
                                {/*  <BagCheck className='e-bag'/> */}
                                <p className='price'>Rs 3,500</p>
                            </div>
                            <div className="col lg-1 ">
                                <img className='sell-img' src='https://fbpros3v1.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2023/10/0304505153PNK-1_Ladies-skirt_fashion-bug_srilanka_compressed-300x382.jpg'></img>
                                <p className="img-des">Slick over tshirt</p>
                                {/*  <BagCheck className='e-bag'/> */}
                                <p className='price'>Rs 4,000</p>
                            </div>
                        </div>
                        <button className="explore-btn">Explore more {/* <ArrowRight /> */}</button>
                    </div>
                </div>

                <div className="section3">
                    <div className="row">
                        <div className="col-sm-3">
                            <img className='round-img' src='https://fbpros3v1.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2023/11/0307008065GRN-1_Ladies-Crop-Top_Fashion-Bug-Sri-Lanka-300x382.jpg'></img>
                        </div>
                        <div className="col-sm-6 text-line">BROWSE USING <span className='ai-gen'>AI GENERATED</span> SEARCH ENGINE TO FIND ALL
                            YOUR FASHION NEED'S IN ONE PLACE
                            <button className="begin-btn">click to begin {/* <ArrowRight /> */}</button>
                        </div>

                        <div className="col-sm-3">
                            <div className="col-sm-3">
                                <img className='round-img' src='https://fbpros3v1.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2023/11/0307008065PNK-2_Ladies-Crop-Top_Fashion-Bug-Sri-Lanka-300x382.jpg'></img>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section-4">
                    <h3>Shop by Categoty</h3>
                    <button className="shop-btn">Men </button>
                    <button className="shop-btn">Women </button>
                    <button className="shop-btn">Kids</button>
                    <button className="shop-btn">Latest </button>
                    <button className="shop-btn">Trending </button>
                </div>

                <div className="trending-area">
                    <div className="row">
                        <div className="col-sm-9"> <h2 className='heading-main' >BEST SELLING</h2></div>
                        <div className="col-sm-3"> <p className='selling-text'>Best selling product</p></div>
                    </div>


                    <div className="photo-area">
                        <div className="row">
                            <div className="col mx-1 ">
                                <img className='sell-img' src='https://fbpros3v1.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2023/11/0304505162WHT-FRE-3Ladies-dress_fashion-bug_srilanka_compressed_compressed-300x382.jpg'></img>
                                <p className="img-des">Slick over tshirt</p>
                                {/*  <BagCheck className='e-bag'/> */}
                                <p className='price'>Rs 6,000</p>

                            </div>
                            <div className="col mx-1 ">
                                <img className='sell-img' src='https://fbpros3v1.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2023/10/0304505153PNK-1_Ladies-skirt_fashion-bug_srilanka_compressed-300x382.jpg'></img>
                                <p className="img-des">Slick over tshirt</p>
                                {/*  <BagCheck className='e-bag'/> */}
                                <p className='price'>Rs 4,000</p>
                            </div>
                            <div className="col mx-1 ">
                                <img className='sell-img' src='https://fbpros3v1.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2023/11/0304505162WHT-FRE-3Ladies-dress_fashion-bug_srilanka_compressed_compressed-300x382.jpg'></img>
                                <p className="img-des">Slick over tshirt</p>
                                {/*  <BagCheck className='e-bag'/> */}
                                <p className='price'>Rs 5,000</p>
                            </div>
                            <div className="col mx-1 ">
                                <img className='sell-img' src='https://fbpros3v1.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2023/10/0304505153PNK-1_Ladies-skirt_fashion-bug_srilanka_compressed-300x382.jpg'></img>
                                <p className="img-des">Slick over tshirt</p>
                                {/*  <BagCheck className='e-bag'/> */}
                                <p className='price'>Rs 3,500</p>
                            </div>
                            <div className="col mx-1 ">
                                <img className='sell-img' src='https://fbpros3v1.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2023/10/0304505153PNK-1_Ladies-skirt_fashion-bug_srilanka_compressed-300x382.jpg'></img>
                                <p className="img-des">Slick over tshirt</p>
                                {/*  <BagCheck className='e-bag'/> */}
                                <p className='price'>Rs 2,000</p>
                            </div>
                        </div>
                        <button className="explore-btn">Explore more {/* <ArrowRight /> */}</button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default LandingPage;
