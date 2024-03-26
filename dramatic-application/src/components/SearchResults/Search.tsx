import React, { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
import { searchByQuery } from "../../services/apiService";
const SearchResults = () => {

    const params: any = useParams();
    const searchValue: string = params.name;


    const [searchResult, setSearchResult] = useState<any[]>([]);


    const callSearch = async () => {
        try {
            const searchResultsData = await searchByQuery(searchValue);
            console.log(searchResultsData);
            setSearchResult(searchResultsData);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }

    useEffect(() => {
        callSearch()
    }, []);


    const itemClick = (product: any) => {
        console.log(product);
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
                                    <h2>{item.title}</h2>
                                    <p>{item.price}</p>
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