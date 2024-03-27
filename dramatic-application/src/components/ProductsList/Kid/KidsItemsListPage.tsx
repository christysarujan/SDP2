import React, { useState, useEffect } from 'react';
import './KidsItemsListPage.scss'; // Import SCSS file
import { useNavigate } from 'react-router-dom';
import { getProductsByCategory, getProductImage } from '../../../services/apiService';
import PriceRangeSlider from '../PriceRangeSlider/PriceRangeSlider'; // Import the PriceRangeSlider component

interface Item {
  finalPrice: any;
  discount: number;
  productId: string;
  id: number;
  title: string;
  price: string | JSX.Element;
  image: any;
  sellerEmail: string;
  material: string;
  category: string;
  size: string;
  newPrice?: number; // New field for discounted price
  color: string; // Color property
  productCategory: string; // Product category property
  style: string; // Style property
}

function KidsItemsListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    size: '',
    material: '',
    color: '', // Color filter
    priceRange: { min: 0, max: 10000 },
    productCategory: '', // Product category filter
    style: '', // Style filter
  });
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [uniqueSizes, setUniqueSizes] = useState<string[]>([]);
  const [uniqueMaterials, setUniqueMaterials] = useState<string[]>([]);
  const [uniqueColors, setUniqueColors] = useState<string[]>([]);
  const [uniqueProductCategories, setUniqueProductCategories] = useState<string[]>([]);
  const [uniqueStyles, setUniqueStyles] = useState<string[]>([]);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchKidsItems();
  }, [filters]);

  const itemClick = async (item: Item) => {
    setSelectedItem(item);
    navigate(`/viewproduct/${item.productId}`);
  };

  const fetchKidsItems = async () => {
    try {
      const data = await getProductsByCategory('kid');
      const kidsItems = await Promise.all(data.map(async (item: any, index: number) => ({
        productId: item.productId,
        id: index,
        title: item.name,
        price: renderPrice(item.price, item.discount, item.newPrice), // Using renderPrice function for price display
        finalPrice: item.discount === 0 ? item.price : item.newPrice,
        image: await getProductPhoto(await getProductImage(item.productImages[0].productImageUrl)),
        sellerEmail: item.sellerEmail,
        material: item.material,
        category: item.category,
        size: item.variations.map((variation: any) => variation.sizeQuantities.map((sizeQty: any) => sizeQty.size)).flat(),
        newPrice: item.newPrice, // Include newPrice in the item object
        color: item.variations.map((variation: any) => variation.color).join(', '), // Combine colors
        productCategory: item.productCategory, // Include productCategory in the item object
        style: item.style, // Include style in the item object
      })));

      setItems(kidsItems);

      const categories = kidsItems.map(item => item.category);
      const sizes = kidsItems.flatMap(item => item.size);
      const materials = kidsItems.map(item => item.material);
      const colors = kidsItems.flatMap(item => item.color.split(', '));
      const productCategories = kidsItems.map(item => item.productCategory);
      const styles = kidsItems.map(item => item.style);

      setUniqueCategories(Array.from(new Set(categories)));
      setUniqueSizes(Array.from(new Set(sizes)));
      setUniqueMaterials(Array.from(new Set(materials)));
      setUniqueColors(Array.from(new Set(colors)));
      setUniqueProductCategories(Array.from(new Set(productCategories.filter(category => category))));
      setUniqueStyles(Array.from(new Set(styles.filter(style => style))));
    } catch (error) {
      console.error('Error fetching kids items:', error);
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

  const renderPrice = (price: number, discount?: number, newPrice?: number): string | JSX.Element => {
    if (discount && newPrice) {
      return (
        <>
          <span style={{ textDecoration: 'line-through' }}>{price} Rs.</span>{' '}
          <strong style={{ color: 'red' }}>{newPrice} Rs.</strong>
        </>
      );
    } else {
      return `${price} Rs.`;
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

  if (filters.color) {
    filteredItems = filteredItems.filter(item => item.color.toLowerCase().includes(filters.color.toLowerCase()));
  }

  if (filters.productCategory) {
    filteredItems = filteredItems.filter(item => item.productCategory === filters.productCategory);
  }

  if (filters.style) {
    filteredItems = filteredItems.filter(item => item.style === filters.style);
  }

  filteredItems = filteredItems.filter(item => {
    const isInPriceRange = item.finalPrice >= filters.priceRange.min && item.finalPrice <= filters.priceRange.max;
    return isInPriceRange;
  });

  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="kids-items-list-page">
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
            <option key={index} value={color}>{color}</option>
          ))}
        </select>
        <label htmlFor="productCategory">Product Category:</label>
        <select id="productCategory" onChange={e => handleFilterChange(e.target.value, 'productCategory')} value={filters.productCategory}>
          <option value="">All</option>
          {uniqueProductCategories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        <label htmlFor="style">Style:</label>
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

export default KidsItemsListPage;
