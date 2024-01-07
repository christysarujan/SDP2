import React, { useEffect, useState } from 'react'
import './Inventory.scss'
import { getProductsByProductId } from '../../services/apiService';
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';

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

const Inventory = () => {

    const [count, setCount] = useState<{ [key: string]: number }>({});
    const [productData, setProductData] = useState<ProductData | null>(null);
    const [formValues, setFormValues] = useState<{ [key: string]: number }>({});

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
        const productData = await getProductsByProductId('6594f52a93e09b2a1d7b986f');
        setProductData(productData);
        // Initialize count with the initial stock values
        const initialCount: { [key: string]: number } = {};
        productData?.variations.forEach((variation: Variation) => {
            variation.sizeQuantities.forEach((sizeQty: SizeQuantity) => {
                initialCount[`${variation.color}_${sizeQty.size}`] = sizeQty.qty;
            });
        });
        setCount(initialCount);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, color: string, size: string) => {
        const value = parseInt(event.target.value, 10);
        // Update the count state with the new input value
        setCount((prevCount) => ({
            ...prevCount,
            [`${color}_${size}`]: isNaN(value) ? 0 : value,
        }));
    };

    const handleSubmit = () => {
        // Transform count state into the desired format for submission
        const submitData: { color: string; sizeQuantityDTOS: { size: string; qty: number }[] }[] = Object.keys(count).map((key) => {
            const [color, size] = key.split('_');
            return {
                color,
                sizeQuantityDTOS: [
                    {
                        size,
                        qty: count[key],
                    },
                ],
            };
        });

        // Combine submitData for the same color into a single object
        const groupedSubmitData = submitData.reduce((acc, item) => {
            const existingItem = acc.find((el) => el.color === item.color);

            if (existingItem) {
                existingItem.sizeQuantityDTOS.push(...item.sizeQuantityDTOS);
            } else {
                acc.push(item);
            }

            return acc;
        }, [] as { color: string; sizeQuantityDTOS: { size: string; qty: number }[] }[]);

        // Use groupedSubmitData for further processing or submission
        console.log('Submit Data:', groupedSubmitData);
    };

    const validationSchema = Yup.object().shape({
        // Define your validation rules here if needed
    });



    return (
        <div className='inventory-main'>
            <div className="header">
                <p>Product List</p>
                <hr />
            </div>
            <div className="product-content">
                <div className="product-details">
                    <div className="product-img"></div>
                    <h5 className='p-name'>New Frock 2K24</h5>
                    <p className='p-id'>Product ID : 12345</p>
                    <h5 className='p-price'>LKR 2500</h5>
                </div>
                {productData && (
                    <div  className="product-quantity">
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
                                        <button className="btn btn-secondary" onClick={() => setFormValues({})}>
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
