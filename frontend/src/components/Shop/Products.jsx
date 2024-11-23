import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { IoOptionsOutline, IoArrowForwardSharp } from 'react-icons/io5';
import { FaCartPlus } from 'react-icons/fa6';
import { IoMdHeartEmpty } from 'react-icons/io';
import BgImage from '../../assets/Bannar.png';

const API_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:5000/api'
  : '/api';

axios.defaults.withCredentials = true;

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalProduct, setTotalProduct] = useState(0);
  const [priceRange, setPriceRange] = useState([2, 100]);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/category-count`);
        if (response.data.success) {
          setCategories(response.data.data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Show loading indicator
      try {
        const response = await axios.get(`${API_URL}/get-all-products`);
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          console.error('Failed to fetch products:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false); // Hide loading indicator
      }
    };

    fetchProducts();
  }, []);

  // Fetch total of all products
  useEffect(() => {
    const fetchTotalProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products-total`);
        if (response.data.success) {
          setTotalProduct(response.data.total);
        } else {
          console.error('Failed to fetch total products');
        }
      } catch (error) {
        console.error('Error fetching total products:', error);
      }
    };

    fetchTotalProducts();
  }, []);

  // Calculate paginated products
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const paginatedProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  useEffect(() => {
    // On component load, check if there's a saved page in localStorage
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10)); // Set the saved page as the initial page
    }
  }, []);
  
  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
    localStorage.setItem('currentPage', pageNumber); // Save the current page to localStorage
    setLoading(true); // Show loading indicator during pagination
    setTimeout(() => {
      setLoading(false); // Simulate a delay for loading
    }, 2000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="my-[5vw] px-[2vw] md:my-[2vw] md:px-[8vw] mb-[5vw]">
      <div className="md:grid md:grid-cols-4 gap-6 mt-[2vw]">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-col md:col-span-1">
          {/* Filter Button */}
          <button className="bg-Primary text-white w-[6.5vw] h-[2.5vw] rounded-full flex justify-center items-center font-Poppins mb-6">
            <span>Filter</span>
            <IoOptionsOutline className="w-[2vw] h-[1.3vw]" />
          </button>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-[1.3vw] text-Gray700 font-semibold font-Poppins mb-4">Categories</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.name} className="flex items-center space-x-[0.5vw]">
                  <span className="text-[1vw] text-Gray800 font-Poppins">{category.name}</span>
                  {category.count && (
                    <span className="text-[1vw] text-Gray500 font-Poppins">({category.count})</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range */}
          <div className="mb-6 range-container">
            <h3 className="text-[1.3vw] text-Gray700 font-semibold font-Poppins mb-4">Price</h3>
            <input
              type="range"
              className="w-full"
              min="2"
              max="100"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value)])
              }
            />
            <div className="flex justify-between font-Poppins text-sm mt-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          {/* Discount Banner */}
          <div className="bg-gray-100 rounded-2xl h-[23vw] p-[2vw] text-center relative overflow-hidden">
            <div
              className="absolute inset-0 top-0 right-0 left-0 -bottom-32"
              style={{
                backgroundImage: `url(${BgImage})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                zIndex: 0,
              }}
            ></div>
            <div className="relative z-10">
              <h2 className="text-Gray900 font-Poppins text-[1.7vw]">
                <span className="text-[2vw] font-bold font-Poppins text-orange-500 mr-1">79%</span>
                Discount
              </h2>
              <p className="text-Gray600 font-Poppins text-[1vw] mb-2">on your first order</p>
              <button
                onClick={() => {
                  window.location.href = '/shop';
                  window.scrollTo(0, 0);
                }}
                className="text-Primary rounded-full font-Poppins text-[1vw] flex justify-center items-center mx-auto gap-[0.3vw]"
              >
                Shop Now
                <IoArrowForwardSharp className="text-[1.3vw]" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-Primary"></div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-[0.7vw] md:gap-[0.3vw] font-Poppins md:text-[1vw] text-Gray600">
                  {totalProduct}
                  <span>Products Found</span>
                </div>
                <select className="border border-Gray300 outline-none font-Poppins focus:border-Primary rounded px-3 py-2">
                  <option className="font-Poppins">Latest</option>
                  <option className="font-Poppins">Price: Low to High</option>
                  <option className="font-Poppins">Price: High to Low</option>
                  <option className="font-Poppins">Rating</option>
                </select>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-[6vw] md:gap-[3vw]">
                {paginatedProducts.map((product) => (
                  <div key={product._id} className="border rounded-lg relative">
                    <Link to={`/product/${encodeURIComponent(product.name)}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-[30vw] md:h-[15vw] object-cover rounded-t-lg"
                    /></Link>
                    <div className="mt-1 p-[1vw]">
                      <div className="h-[17vw] md:h-[5vw]">
                        <h3 className="font-Poppins text-[3.5vw] md:text-[1.1vw] text-Gray800">{product.name}</h3>
                        <span className="font-semibold font-Poppins md:text-[1vw] text-Gray800">
                          ${product.salePrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 mt-[0.5vw]">
                        <button className="bg-Primary w-[70vw] h-[8vw] md:h-[2.5vw] rounded-lg flex items-center justify-center space-x-1 text-White">
                          <FaCartPlus className="w-[5vw] h-[5vw] md:w-5 md:h-5" />
                          <span className="font-Poppins text-[3.5vw] md:text-[1.1vw]">Add to cart</span>
                        </button>
                        <button className="p-2 bg-GreenGray100 text-Primary rounded-full">
                          <IoMdHeartEmpty className="w-[6vw] h-[6vw] md:w-5 md:h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-8">
                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-4 py-2 border rounded-full mx-1 ${
                      pageNumber === currentPage
                        ? 'bg-Primary text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
