import { useEffect, useState, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';
import Slider from 'react-slick';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "../Slider/Customdots.css"; 
import useCartStore from '../../store/useCartStore';
import {toast} from 'react-toastify';
import WishlistButton from '../Wishlist/WishlistButton';

const API_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:5000/api'
    : 'https://echobazar-fn59.vercel.app/api';

axios.defaults.withCredentials = true;

const NewProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);
    const sliderRef = useRef(null);

    const { addToCart } = useCartStore();

    const handleAddToCart = (product) => {
        addToCart(product);
        toast.success(`${product.name} has been added to your cart!`);
    };

    // Fetch products from the backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/products-newest`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Slider settings
    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        beforeChange: (_, newIndex) => setActiveSlide(newIndex),
        responsive: [
            {
                breakpoint: 768,
                settings: { slidesToShow: 2 }
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 2 }
            }
        ]
    };

    return (
        <section className='my-[8vw] md:my-[3vw] px-[2vw] md:px-[8vw]'>
            <div className='flex justify-between items-center mb-[4vw] md:mb-0'>
                <h2 className='font-Poppins text-[6vw] md:text-[2vw] font-semibold'>New Products</h2>
                <Link to='/shop' onClick={() => window.scrollTo(0,0)}  className='flex gap-1 md:gap-2 items-center text-Primary text-[4vw] md:text-[1.2vw] font-Poppins'>
                    View All <BsArrowRight className='text-[5vw] md:text-[1.2vw]' />
                </Link>
            </div>

            {loading ? (
                <div className="flex flex-col justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-Primary"></div>
                <p
                    className="mt-4 text-Primary text-[3.7vw] md:text-[1.2vw] font-semibold font-Poppins">Loading product details...</p>
            </div>
            ) : (
                <>
                    <Slider {...sliderSettings} ref={sliderRef} className="my-[2vw] overflow-hidden">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} handleAddToCart={handleAddToCart} />
                        ))}
                    </Slider>

                    {/* Custom Dots */}
                    <div className="slick-dots">
                        {products.map((_, index) => (
                            <button
                                key={index}
                                className={`dot ${activeSlide === index ? "slick-active" : ""}`}
                                onClick={() => sliderRef.current.slickGoTo(index)}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

// Product Card Component
const ProductCard = ({ product, handleAddToCart }) => (
    <div className="px-2 md:px-4">
        <div className="group relative bg-white rounded-lg transition-all duration-300 border border-Gray100 hover:border-Primary hover:shadow-lg">
            <div className="relative aspect-square ">
                <Link to={`/product/${encodeURIComponent(product.name)}`} onClick={() => window.scrollTo(0,0)}>
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-t-lg" />
                </Link>
                <WishlistButton product={product} />
            </div>
            <div className="p-2 md:p-4">
            <h3 className="text-Gray800 text-[4vw] md:text-[1vw] font-medium mb-1 md:mb-2 font-Poppins overflow-hidden text-ellipsis whitespace-nowrap">
    {product.name}
</h3>

                <div className="flex space-x-[2vw] md:space-x-[0.5vw] items-center mt-[1vw] md:mt-0">
                    <span className="text-Gray900 text-[4vw] md:text-[1vw] font-semibold font-Poppins">
                        ${product.salePrice.toFixed(2)}
                    </span>
                    <p className="text-[4vw] md:text-[1vw] font-Poppins line-through text-Gray500">
                            ${
                                product
                                    .regularPrice
                                    .toFixed(2)
                            }
                        </p>
                </div>
                    <div className="flex items-center justify-between mt-[1vw] md:mt-0">
                        <div className="flex mr-2">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-[5vw] md:text-[1.3vw] ${i < product.rating ? 'text-yellow-400' : 'text-Gray300'}`}>
                                    ★
                                </span>
                            ))}
                        </div>
                        <button
                        onClick={() => handleAddToCart(product)}
                         className="group-hover:bg-Primary group-hover:border-Primary group-hover:shadow-md p-2 rounded-full border border-gray-200 transition-all duration-300">
                            <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-white" />
                        </button>
                    </div>
            </div>
        </div>
    </div>
);

export default NewProducts;
