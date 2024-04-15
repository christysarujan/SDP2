import React, { useEffect, useState } from 'react'
import './Inventory.scss'
import { getProductsByProductId, updateColorQuantity } from '../../services/apiService';
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';

interface SizeQuantity {
    size: string;
    qty: number;
}

interface Variation {
    color: string;
    sizeQuantities: SizeQuantity[];
}

interface ProductData {
    productId: string;
    sellerEmail: string;
    name: string;
    material: string;
    price: number;
    category: string;
    variations: Variation[];
}

const Inventory = ({ productId, onClose }: { productId: string | null; onClose: () => void }) => {

    const [count, setCount] = useState<{ [key: string]: number }>({});
    const [productData, setProductData] = useState<ProductData | null>(null);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        getProductData();
    }, []);


    const handleIncrement = (color: string, size: string) => {
        setCount((prevCount) => ({
            ...prevCount,
            [`${color}_${size}`]: (prevCount[`${color}_${size}`] || 0) + 1,
        }));
    };

    const handleDecrement = (color: string, size: string) => {
        setCount((prevCount) => ({
            ...prevCount,
            [`${color}_${size}`]: Math.max((prevCount[`${color}_${size}`] || 0) - 1, 0),
        }));
    };

    const getProductData = async () => {
        if (productId) {
            const productData = await getProductsByProductId(productId);
            setProductData(productData);
            console.log('p-data', productData);

            const initialCount: { [key: string]: number } = {};
            productData?.variations.forEach((variation: Variation) => {
                variation.sizeQuantities.forEach((sizeQty: SizeQuantity) => {
                    initialCount[`${variation.color}_${sizeQty.size}`] = sizeQty.qty;
                });
            });
            setCount(initialCount);
        }
        // const productData = await getProductsByProductId('6594f52a93e09b2a1d7b986f');      
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, color: string, size: string) => {
        const value = parseInt(event.target.value, 10);
        // Update the count state with the new input value
        setCount((prevCount) => ({
            ...prevCount,
            [`${color}_${size}`]: isNaN(value) ? 0 : value,
        }));
    };

    const handleSubmit = async () => {
        // Transform count state into the desired format for submission
        const submitData: { color: string; sizeQuantities: { size: string; qty: number }[] }[] = Object.keys(count).map((key) => {
            const [color, size] = key.split('_');
            return {
                color,
                sizeQuantities: [
                    {
                        size,
                        qty: count[key],
                    },
                ],
            };
        });

        // Combine submitData for the same color into a single object
        const groupedSubmitData = submitData.reduce((acc, item) => {
            const existingIndex = acc.findIndex((el) => el.color === item.color);

            if (existingIndex !== -1) {
                // Combine sizeQuantities for the same color
                acc[existingIndex].sizeQuantities.push(...item.sizeQuantities);
            } else {
                // Add a new entry for a unique color
                acc.push({ color: item.color, sizeQuantities: item.sizeQuantities });
            }

            return acc;
        }, [] as { color: string; sizeQuantities: { size: string; qty: number }[] }[]);


        // Use groupedSubmitData for further processing or submission
        console.log('Submit Data:', groupedSubmitData);
        if (productData) {
            const updateColorQty = await updateColorQuantity(groupedSubmitData, productData?.productId)
            getProductData();
        }
    };

    const validationSchema = Yup.object().shape({
        // Define your validation rules here if needed
    });



    return (
        <div className='inventory-main'>
            {/*   <div className="header">
                <p>Product List</p>
                <hr />
            </div> */}
            <div className="product-content">
                <div className="product-details">
                    <div className="product-img"></div>
                    <h5 className='p-name'>{productData?.name}</h5>
                    <p className='p-id'>Product ID : {productData?.productId}</p>
                    <h5 className='p-price'>LKR {productData?.price}</h5>
                </div>
                {productData && (
                    <div className="product-quantity">
                        <Formik
                            initialValues={{ count }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            <Form>
                                <div>
                                    <div className="variation-details">
                                        {productData.variations.map((variation, index) => (
                                            <div key={index} className="single-data">
                                                <p className="size">Color : {variation.color}</p>
                                                {variation.sizeQuantities.map((sizeQty, sizeIndex) => (
                                                    <div key={sizeIndex} className="input-data">
                                                        <p className="size">{sizeQty.size}</p>
                                                        <p className="in-stock">In Stock: {sizeQty.qty}</p>
                                                        <button type='button' onClick={() => handleDecrement(variation.color, sizeQty.size)} className="btn-change-value">
                                                            -
                                                        </button>
                                                        <Field
                                                            type="text"
                                                            name={`count.${variation.color}_${sizeQty.size}`}
                                                            value={count[`${variation.color}_${sizeQty.size}`] || 0}
                                                            onChange={(e: any) => handleInputChange(e, variation.color, sizeQty.size)}
                                                        />
                                                        <button type='button' onClick={() => handleIncrement(variation.color, sizeQty.size)} className="btn-change-value">
                                                            +
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="btn-section">
                                        <button type='button' className="btn btn-secondary" onClick={() => onClose()}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </Form>
                        </Formik>
                    </div>

                )}
            </div>
        </div>
    )
}

export default Inventory
