import React, { useState, useEffect } from 'react';
import './MenItemsListPage.scss'; // Import SCSS file
import { useNavigate } from 'react-router-dom';
import { getProductsByCategory, getProductImage } from '../../../services/apiService';
import PriceRangeSlider from '../PriceRangeSlider/PriceRangeSlider'; // Import the PriceRangeSlider component

interface Item {
  discount: number;
  newPrice: any;
  productId: string;
  id: number;
  title: string;
  price: string | JSX.Element;
  image: any;
  sellerEmail: string;
  material: string;
  category: string;
  size: string;
}

function MenItemsListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    size: '',
    material: '',
    priceRange: { min: 0, max: 10000 }
  });
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [uniqueSizes, setUniqueSizes] = useState<string[]>([]);
  const [uniqueMaterials, setUniqueMaterials] = useState<string[]>([]);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchMenItems();
  }, [filters]);

  const itemClick = async (item: Item) => {
    setSelectedItem(item);
    navigate(`/viewproduct/${item.productId}`);
  };

  const fetchMenItems = async () => {
    try {
      const data = await getProductsByCategory('men');
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
        sellerEmail: item.sellerEmail,
        material: item.material,
        category: item.category,
        size: item.variations.map((variation: any) => variation.sizeQuantities.map((sizeQty: any) => sizeQty.size)).flat(),
        newPrice: item.newPrice // Include newPrice in the item object
      })));
  
      setItems(menItems);
  
      const categories = menItems.map(item => item.category);
      const sizes = menItems.map(item => item.size).flat();
      const materials = menItems.map(item => item.material);
  
      setUniqueCategories(Array.from(new Set(categories)));
      setUniqueSizes(Array.from(new Set(sizes)));
      setUniqueMaterials(Array.from(new Set(materials)));
    } catch (error) {
      console.error('Error fetching men items:', error);
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

  const handleFilterChange = (value: any, filterType: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  let filteredItems = items;

  if (filters.category) {
    filteredItems = filteredItems.filter(item => item.category === filters.category);
  }

  if (filters.size) {
    filteredItems = filteredItems.filter(item => item.size.includes(filters.size));
  }

  if (filters.material) {
    filteredItems = filteredItems.filter(item => item.material === filters.material);
  }

  //saved logic

  filteredItems = filteredItems.filter(item => {
    let price: number;

    // Check if discount is applied
    if (typeof item.price === 'number' && item.discount === 0) {
        // If no discount, use original price for filtering
        price = item.price;
    } else if (typeof item.newPrice === 'number' && item.discount > 0) {
        price = item.newPrice;
    } else {
        // If neither condition is met, skip this item
        return true;
    }
     
    // Check if the price falls within the specified range
    return price >= filters.priceRange.min && price <= filters.priceRange.max;
});




  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="men-items-list-page">
     
      <div className="filters">
        <h2>Filters</h2>
        <label htmlFor="category">Category:</label>
        <select id="category" onChange={e => handleFilterChange(e.target.value, 'category')} value={filters.category}>
          <option value="">All</option>
          {uniqueCategories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        <label htmlFor="size">Size:</label>
        <select id="size" onChange={e => handleFilterChange(e.target.value, 'size')} value={filters.size}>
          <option value="">All</option>
          {uniqueSizes.map((size, index) => (
            <option key={index} value={size}>{size}</option>
          ))}
        </select>
        <label htmlFor="material">Material:</label>
        <select id="material" onChange={e => handleFilterChange(e.target.value, 'material')} value={filters.material}>
          <option value="">All</option>
          {uniqueMaterials.map((material, index) => (
            <option key={index} value={material}>{material}</option>
          ))}
        </select>
        <PriceRangeSlider
          minPrice={0} // Define your minimum price
          maxPrice={10000} // Define your maximum price
          value={filters.priceRange}
          onChange={(value) => handleFilterChange(value, 'priceRange')}
        />
      </div>
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
        {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MenItemsListPage;
