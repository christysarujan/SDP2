import React, { useState, useEffect } from 'react';
import './WomenItemsListPage.scss'; // Import SCSS file
import { useNavigate } from 'react-router-dom';
import { getProductsByCategory, getProductImage } from '../../../services/apiService';
import PriceRangeSlider from '../PriceRangeSlider/PriceRangeSlider'; // Import the PriceRangeSlider component

interface Item {
  finalPrice: any;
  productId: string;
  id: number;
  title: string;
  price: string | JSX.Element;
  image: any;
  sellerEmail: string;
  material: string;
  category: string;
  size: string;
  newPrice: number;
  discount: number;
  color: string; // Add color property to Item interface
  productCategory: string; // Add productCategory property to Item interface
  style: string; // Add style property to Item interface
}

function WomenItemsListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    size: '',
    material: '',
    color: '', // Add color filter to state
    productCategory: '', // Add productCategory filter to state
    style: '', // Add style filter to state
    priceRange: { min: 0, max: 10000 }
  });
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [uniqueSizes, setUniqueSizes] = useState<string[]>([]);
  const [uniqueMaterials, setUniqueMaterials] = useState<string[]>([]);
  const [uniqueColors, setUniqueColors] = useState<string[]>([]);
  const [uniqueProductCategories, setUniqueProductCategories] = useState<string[]>([]); // Add uniqueProductCategories state
  const [uniqueStyles, setUniqueStyles] = useState<string[]>([]); // Add uniqueStyles state
  const itemsPerPage = 12;

  useEffect(() => {
    fetchWomenItems();
  }, [filters]);

  const itemClick = async (item: Item) => {
    setSelectedItem(item);
    navigate(`/viewproduct/${item.productId}`);
  };

  const fetchWomenItems = async () => {
    try {
      const data = await getProductsByCategory('women');
      const womenItems = await Promise.all(data.map(async (item: any, index: number) => ({
        productId: item.productId,
        id: index,
        title: item.name,
        price: item.discount === 0 ? `${item.price} Rs.` : (
          <>
            <span style={{ textDecoration: 'line-through' }}>{item.price} Rs.</span>{' '}
            <strong style={{ color: 'red' }}>{item.newPrice} Rs.</strong>
          </>
        ),
        finalPrice: item.discount === 0 ? item.price : item.newPrice,
        image: await getProductPhoto(await getProductImage(item.productImages[0].productImageUrl)),
        sellerEmail: item.sellerEmail,
        material: item.material,
        category: item.category,
        size: item.variations.map((variation: any) => variation.sizeQuantities.map((sizeQty: any) => sizeQty.size)).flat(),
        newPrice: item.newPrice,
        discount: item.discount,
        color: item.variations.map((variation: any) => variation.color).join(', '),
        productCategory: item.productCategory, // Include productCategory in the item object
        style: item.style // Include style in the item object
      })));

      setItems(womenItems);

      const categories = womenItems.map(item => item.category);
      const sizes = womenItems.flatMap(item => item.size);
      const materials = womenItems.map(item => item.material);
      const colors = womenItems.flatMap(item => item.color.split(', '));
      const productCategories = womenItems.map(item => item.productCategory); // Extract product categories
      const styles = womenItems.map(item => item.style); // Extract styles

      setUniqueCategories(Array.from(new Set(categories)));
      setUniqueSizes(Array.from(new Set(sizes)));
      setUniqueMaterials(Array.from(new Set(materials)));
      setUniqueColors(Array.from(new Set(colors)));
      setUniqueProductCategories(Array.from(new Set(productCategories.filter(category => category))));
      setUniqueStyles(Array.from(new Set(styles.filter(style => style))));
 
    } catch (error) {
      console.error('Error fetching women items:', error);
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

  let filteredItems: Item[] = items;

  if (filters.category) {
    filteredItems = filteredItems.filter(item => item.category === filters.category);
  }

  if (filters.size) {
    filteredItems = filteredItems.filter(item => item.size.includes(filters.size));
  }

  if (filters.material) {
    filteredItems = filteredItems.filter(item => item.material === filters.material);
  }

  if (filters.color) {
    filteredItems = filteredItems.filter(item => item.color.toLowerCase().includes(filters.color.toLowerCase()));
  }

  if (filters.productCategory) { // Apply filter for productCategory
    filteredItems = filteredItems.filter(item => item.productCategory === filters.productCategory);
  }

  if (filters.style) { // Apply filter for style
    filteredItems = filteredItems.filter(item => item.style === filters.style);
  }

  // Filter function to include items based on price range
  filteredItems = filteredItems.filter(item => {
    return item.finalPrice >= filters.priceRange.min && item.finalPrice <= filters.priceRange.max;
  });

  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="women-items-list-page">
      <div className="filters">
        <h2>Filters</h2>
        {/* <label htmlFor="category">Category:</label>
        <select id="category" onChange={e => handleFilterChange(e.target.value, 'category')} value={filters.category}>
          <option value="">All</option>
          {uniqueCategories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select> */}
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
        <label htmlFor="color">Color:</label>
        <select id="color" onChange={e => handleFilterChange(e.target.value, 'color')} value={filters.color}>
          <option value="">All</option>
          {uniqueColors.map((color, index) => (
            <option key={index} value={color.toLowerCase()}>{color}</option>
          ))}
        </select>
        <label htmlFor="productCategory">Product Category:</label> {/* Add productCategory filter */}
        <select id="productCategory" onChange={e => handleFilterChange(e.target.value, 'productCategory')} value={filters.productCategory}>
          <option value="">All</option>
          {uniqueProductCategories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        <label htmlFor="style">Style:</label> {/* Add style filter */}
        <select id="style" onChange={e => handleFilterChange(e.target.value, 'style')} value={filters.style}>
          <option value="">All</option>
          {uniqueStyles.map((style, index) => (
            <option key={index} value={style}>{style}</option>
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

export default WomenItemsListPage;
