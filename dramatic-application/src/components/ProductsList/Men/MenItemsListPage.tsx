import React, { useState, useEffect } from 'react';
import './MenItemsListPage.scss'; // Import SCSS file
import { useNavigate } from 'react-router-dom';
import { getProductsByCategory, getProductImage } from '../../../services/apiService';

interface Item {
  productId: string;
  id: number;
  title: string;
  price: string | JSX.Element; // Updated type to string | JSX.Element
  image: any;
  sellerEmail: string; // Assuming sellerEmail is a property of the Item object
}

function MenItemsListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchMenItems()
      .then(data => {
        setItems(data);
      })
      .catch(error => {
        console.error('Error fetching men items:', error);
      });
  }, []);

  const itemClick = async (item: Item) => {
    setSelectedItem(item);
    // Navigate to the ProductPage with the productId and sellerEmail as parameters
    navigate(`/viewproduct/${item.productId}`);
    //navigate('/path', { state: { name:'Xyz' }})
  };

  const fetchMenItems = async () => {
    try {
      const data = await getProductsByCategory('men'); // Change category to 'men'
      const menItems = await Promise.all(data.map(async (item: any, index: number) => ({
        productId: item.productId,
        id: index,
        title: item.name,
        price: item.discount === 0 ? `${item.price} Rs.` : (
          <>
            <span style={{ textDecoration: 'line-through' }}>{item.price} Rs.</span>{' '}
            <strong style={{ color: 'red' }}>{item.newPrice} Rs.</strong>
          </>
        ),
        image: await getProductPhoto(await getProductImage(item.productImages[0].productImageUrl)),
        sellerEmail: item.sellerEmail // Assuming sellerEmail is a property of the Item object
      })));
      return menItems;
    } catch (error) {
      console.error('Error fetching men items:', error);
      throw error;
    }
  };

  const getProductPhoto = async (imageData: BlobPart) => {
    try {
      const blob = new Blob([imageData], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);
      return imageUrl;
    } catch (error) {
      console.error("Error fetching profile image:", error);
      throw error;
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="men-items-list-page"> {/* Update class name */}
      <h1>Men's Fashion</h1> {/* Update title */}
      <div className="items-list">
        {currentItems.map(item => (
          <div key={item.id} className="item" onClick={() => itemClick(item)}>
            <img src={item.image} alt={item.title} />
            <div className="item-details">
              <h2>{item.title}</h2>
              <p>{item.price}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: Math.ceil(items.length / itemsPerPage) }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
            {i + 1}
          </button>
        ))}
      </div>
      {/* No need to render ProductPage here as navigation is handled */}
    </div>
  );
}

export default MenItemsListPage;
