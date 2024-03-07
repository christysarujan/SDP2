import React, { useEffect, useState } from 'react'
import './SellerProductSingleView.scss'
import { getProductImages, getProductsByProductId } from '../../../services/apiService';
 
interface ProductData {
    productId: string;
    sellerEmail: string;
    name: string;
    material: string;
    price: number;
    category: string;
    productImages: { productImageUrl: string }[];
    variations: { color: string; sizeQuantities: { size: string; qty: number }[] }[];
    productDescription: string;
}

const SellerProductSingleView = ({ productId }: { productId: any; }) => {
    const [pId, setPId] = useState<string | null>('');
    const [productData, setProductData] = useState<ProductData | null>(null);

    /*     useEffect(() => {
            setPId(productId);
            console.log('iiiiii');
        }, []); */

    useEffect(() => {

        getProductDetails(productId);
    }, []);

    const getProductDetails = async (id: string) => {
        const product = await getProductsByProductId(id);
        setProductData(product);
        setPId(id);
        console.log('Product data View', product);
        fetchProductImages(product.productImages[0].productImageUrl);

        console.log('Product img url', product.productImages[0].productImageUrl);
    };
    const [productImg, setProductImg] = useState('');

    const fetchProductImages = async (productName: string): Promise<string | null> => {
        try {
            // const imageData = await getProductImages('a30562a6-71a4-4b19-b6d1-8d4b42007333.png');
            const imageData = await getProductImages(productName);
            const blob = new Blob([imageData], { type: "image/png" });
            const imageUrl = URL.createObjectURL(blob);
            
            setProductImg(prevState => imageUrl);
            return imageUrl;
        } catch (error) {
            console.error("Error fetching product image:", error);
            return null;
        }
    };





    return (
        <div className='single-product-main'>
            <div className="image-main">
                <div className="main-image">
                    <div className="main-img" style={{ backgroundImage: `url(${productImg})` }} >
                    </div>
                </div>
                <div className="sub-images">
                    <div className="sub-img1"></div>
                    <div className="sub-img2"></div>
                    <div className="sub-img3"></div>
                    <div className="sub-img4"></div>
                </div>
            </div>
            <div className="product-content">
                {productData ?
                    (
                        <div>
                            <div className="product-header">
                                <h5>{productData.name}</h5>
                                <p>Product ID : {productData.productId}</p>
                            </div>
                            <div className="product-body">
                                <h6>LKR {productData.price}</h6>
                                <p>{productData.productDescription}</p>
                            </div>
                            <div className="product-tbl">
                                <table className="table table-bordered table-striped">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>Color</th>
                                            <th>Size</th>
                                            <th>Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productData.variations.map((variation, index) => (
                                            <React.Fragment key={index}>
                                                <tr>
                                                    <td rowSpan={variation.sizeQuantities.length}>{variation.color}</td>
                                                    <td>{variation.sizeQuantities[0].size}</td>
                                                    <td>{variation.sizeQuantities[0].qty}</td>
                                                </tr>
                                                {variation.sizeQuantities.slice(1).map((sizeQty, sqIndex) => (
                                                    <tr key={sqIndex}>
                                                        <td>{sizeQty.size}</td>
                                                        <td>{sizeQty.qty}</td>
                                                    </tr>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>


                        </div>
                    ) : (
                        <div></div>
                    )}
            </div>
        </div>
    )
}

export default SellerProductSingleView
