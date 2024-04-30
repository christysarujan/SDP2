import React, { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
import { getProductImage, getProductsByProductId, searchByQuery } from "../../services/apiService";
import { useNavigate } from 'react-router-dom';


const SearchResults = () => {
    const params: any = useParams();
    const searchValue: string = params.name;
    const [searchResult, setSearchResult] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        callSearch();
    }, [searchValue]);

    const callSearch = async () => {
        try {
            const searchResultsData = await searchByQuery(searchValue);
            console.log(searchResultsData);

            const itemsWithDetails = await Promise.all(searchResultsData.map(async (itemnew: any) => {
                const productDetails = await getProductsByProductId(itemnew.productId);
                const productImage = await getProductImage(productDetails.productImages[0].productImageUrl);
                const image = await getProductPhoto(productImage);
                return { ...itemnew, image }; // merge image into itemnew
            }));

            setSearchResult(itemsWithDetails);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }

    const getProductPhoto = async (imageData: BlobPart) => {
        try {
            const blob = new Blob([imageData], { type: "image/jpeg" });
            const imageUrl = URL.createObjectURL(blob);
            return imageUrl;
        } catch (error) {
            console.error("Error fetching product image:", error);
            throw error;
        }
    };

    const itemClick = (product: any) => {
        console.log(product);
        navigate(`/viewproduct/${product.productId}`);
    }

    return (
        <>
            {searchResult.length > 0 ?
                <div className="women-items-list-page">
                    <div className="items-list">
                        {searchResult.map(item => (
                            <div key={item.id} className="item" onClick={() => itemClick(item)}>
                                <img src={item.image} alt={item.title} />
                                <div className="item-details">
                                    <h2>{item.name}</h2>
                                    {item.discount === 0 ? (
                                        <p>{item.price} Rs.</p>
                                    ) : (
                                        <p>
                                            <span style={{ textDecoration: 'line-through' }}>{item.price} Rs.</span>{' '}
                                            <strong style={{ color: 'red' }}>{item.newPrice} Rs.</strong>
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                : <p>No Products Found for {searchValue}</p>
            }
        </>
    )
}

export default SearchResults;
