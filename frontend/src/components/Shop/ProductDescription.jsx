import {useEffect, useRef, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../Slider/Customdots.css";
import useCartStore from "../../store/useCartStore";
import {FiMinus, FiPlus} from "react-icons/fi";
import {IoMdHeartEmpty} from 'react-icons/io';
import {FaCartPlus} from 'react-icons/fa6';
import {FaCheckCircle, FaExclamationTriangle, FaTimesCircle} from 'react-icons/fa';
import {toast} from 'react-toastify';
import flexImage from '../../assets/product-image.png'
import {Heart, ShoppingCart} from 'lucide-react';

const API_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:5000/api'
    : '/api';

axios.defaults.withCredentials = true;

const ProductDescription = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [activeSlide, setActiveSlide] = useState(0);
    const sliderRef = useRef(null); // Create a reference to access slider methods

    const addItemToCart = useCartStore((state) => state.addToCart);
    const increaseCount = useCartStore((state) => state.increaseCount);
    const cart = useCartStore((state) => state.cart);

    const addToCart = () => {
        const isExisting = cart.some((item) => item.id === product.id);

        addItemToCart({
            ...product,
            quantity: 1
        });

        // Only increase count if the item is not already in the cart
        if (!isExisting) {
            increaseCount();
        }

        toast.success(`${product.name} has been added to your cart!`);
    };

    // Handle increment
    const handleIncrement = () => {
        if (quantity < product.quantity) {
            setQuantity(quantity + 1);
        }
    };

    // Handle decrement
    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Function to calculate the discount percentage
    const calculateDiscount = (regularPrice, salePrice) => {
        if (regularPrice && salePrice) {
            const discount = ((regularPrice - salePrice) / regularPrice) * 100;
            return discount.toFixed(0); // Return a whole number percentage
        }
        return 0; // Return 0 if prices are invalid
    };

    const location = useLocation();
    const pathParts = location
        .pathname
        .split('/');
    const productName = decodeURIComponent(pathParts[pathParts.length - 1]);

    useEffect(() => {
        const fetchProductDetailsAndRelatedProducts = async () => {
            try {
                // Fetch the product by name
                const response = await axios.get(`${API_URL}/products`, {
                    params: {
                        name: productName
                    }
                });

                if (!response.data || !response.data.id) {
                    throw new Error('Product ID not found');
                }

                const productId = response.data.id;

                // Fetch the product details using the ID
                const productResponse = await axios.get(`${API_URL}/products/${productId}`);
                const productData = productResponse.data;

                setProduct(productData);
                setSelectedImage(productData.images[0] || null); // Set default image

                // Fetch related products only if categories exist
                if (productData.categories.length > 0) {
                    const relatedResponse = await axios.get(`${API_URL}/related-products`, {
                        params: {
                            categories: productData
                                .categories
                                .join(',') // Send categories as a comma-separated string
                        }
                    });
                    setRelatedProducts(relatedResponse.data);
                }

                setLoading(false);
            } catch (err) {
                console.error(
                    'Error fetching product details or related products:',
                    err.message
                );
                setError('Failed to fetch product details');
                setLoading(false);
            }
        };

        if (productName) {
            fetchProductDetailsAndRelatedProducts();
        }
    }, [productName]); // Trigger when productName changes

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-Primary"></div>
                <p
                    className="mt-4 text-Primary text-[3.7vw] md:text-[1.2vw] font-semibold font-Poppins">Loading product details...</p>
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4, // Number of slides visible
        slidesToScroll: 1,
        beforeChange: (oldIndex, newIndex) => setActiveSlide(newIndex),
        responsive: [
            {
                breakpoint: 768, // For tablets
                settings: {
                    slidesToShow: 2
                }
            }, {
                breakpoint: 480, // For mobile
                settings: {
                    slidesToShow: 2
                }
            }
        ]
    };

    return (
        <div className='my-[10vw] px-[2vw] md:my-[6vw] md:px-[8vw]'>
            <div className="md:flex md:items-center md:justify-between gap-[3vw]">
                {/* Left Section: Images */}
                <div className="flex flex-col items-center gap-[5vw] md:gap-2 md:w-[50vw]">
                    <div>
                        <img
                            src={selectedImage}
                            alt={product.name}
                            className="h-[70vw] w-[100vw] md:w-[50vw] md:h-[30vw] object-cover rounded-xl md:rounded-3xl"/>
                    </div>
                    <div className="grid grid-cols-3 gap-[1.2vw] md:mt-[2vw]">
                        {
                            product.images && product
                                .images
                                .map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        aria-label={`Select image ${index + 1}`}
                                        loading="lazy"
                                        onClick={() => setSelectedImage(image)}
                                        className={`h-[25vw] w-[30vw] md:w-[20vw] md:h-[9vw] object-cover border ${
                                        selectedImage === image
                                            ? 'border-green-500'
                                            : 'border-gray-300'} rounded-lg cursor-pointer hover:border-green-500`}/>
                                ))
                        }
                    </div>
                </div>

                {/* Right Section: Product Details */}
                <div className="mt-[10vw] md:mt-0 md:w-[50vw]">
                    <h1
                        className="font-Poppins text-[6vw] md:text-[2.5vw] font-semibold text-Gray800">{product.name}
                    </h1>
                    <span
                        className={`flex items-center text-[3.5vw] font-medium font-Poppins md:text-[1vw] text-Gray700 mb-[1.5vw] md:mb-2 ${
                        product.quantity > 10
                            ? ' text-Primary'
                            : product.quantity === 0
                                ? ' text-red-700'
                                : ' text-Warning'}`}>
                        {
                            product.quantity > 10
                                ? (
                                    <div className='flex items-center space-x-[1vw] md:space-x-[0.3vw]'>
                                        <FaCheckCircle className=""/>
                                        <span>In Stock</span>
                                    </div>
                                )
                                : product.quantity === 0
                                    ? (
                                        <div className='flex items-center space-x-[1vw] md:space-x-[0.3vw]'>
                                            <FaTimesCircle className=""/>
                                            <span>Out of Stock</span>
                                        </div>
                                    )
                                    : (
                                        <div className='flex items-center space-x-[1vw] md:space-x-[0.3vw]'>
                                            <FaExclamationTriangle className=""/>
                                            <span>Few units left</span>
                                        </div>
                                    )
                        }
                    </span>
                    {/* <div className="flex items-center gap-2 mb-[1.5vw] md:mb-2">

                   <div className="flex gap-1">
                        {
                            Array.from({
                                length: product.rating || 0
                            }, (_, i) => (
                                <span key={i} className="text-yellow-400">
                                    ★
                                </span>
                            ))
                        }
                        {
                            Array.from({
                                length: 5 - (product.rating || 0)
                            }, (_, i) => (
                                <span key={i} className="text-Primary">
                                    ★
                                </span>
                            ))
                        }
                    </div>
                </div> */
                    }
                    <div className="flex items-center space-x-[3vw] md:space-x-[0.5vw] mb-4">
                        <p className="text-[6vw] md:text-[1.5vw] font-Poppins text-Primary font-bold">
                            ${
                                product
                                    .salePrice
                                    .toFixed(2)
                            }
                        </p>
                        <p className="text-[4vw] md:text-[1vw] font-Poppins line-through text-gray-500">
                            ${
                                product
                                    .regularPrice
                                    .toFixed(2)
                            }
                        </p>
                        <p
                            className="text-red-600 w-[20vw] h-[6.5vw] text-[3vw] md:w-[4vw] md:h-[1.7vw] rounded-lg flex justify-center items-center bg-red-100 md:text-[0.75vw] font-Poppins font-semibold">{calculateDiscount(product.regularPrice, product.salePrice)}% Off</p>
                    </div>
                    <p className="text-[3.7vw] md:text-[1vw] text-Gray700 font-Poppins mb-6">{product.productSummary}</p>

                    {/* Add to Cart Section */}
                    <div className="flex items-center gap-4">
                        <div
                            className="flex justify-around items-center border rounded-3xl py-[0.2vw] w-[30vw] h-[10vw] md:w-[7vw] md:h-[2.7vw]">
                            {/* Decrement Button */}
                            <button onClick={handleDecrement} className={`w-[8vw] h-[8vw] md:w-[2vw] md:h-[2vw] border bg-Gray100 rounded-full text-Gray800 text-[4vw] md:text-[1.2vw] flex justify-center items-center ${
                                quantity === 1
                                    ? "cursor-not-allowed opacity-50"
                                    : ""}`} disabled={quantity === 1}
                                // Disable when quantity is at the minimum
                            >
                                <FiMinus/>
                            </button>

                            {/* Display Current Quantity */}
                            <span className="font-Poppins">{quantity}</span>

                            {/* Increment Button */}
                            <button onClick={handleIncrement} className={`w-[8vw] h-[8vw] md:w-[2vw] md:h-[2vw] border bg-Gray100 rounded-full text-Gray800 text-[4vw] md:text-[1.2vw] flex justify-center items-center ${
                                quantity === product.quantity
                                    ? "cursor-not-allowed opacity-50"
                                    : ""}`} disabled={quantity === product.quantity}
                                // Disable when quantity reaches stock
                            >
                                <FiPlus/>
                            </button>
                        </div>
                        <button
                            onClick={addToCart}
                            className="bg-Primary text-white w-[50vw] h-[10vw] md:w-[20vw] md:h-[2.7vw] rounded-xl md:rounded-full flex items-center justify-center space-x-[2vw] md:space-x-1">
                            <FaCartPlus className="w-[5vw] h-[5vw] md:w-5 md:h-5"/>
                            <span className="font-Poppins text-[3.5vw] md:text-[1.1vw]">Add to cart</span>
                        </button>
                        <button
                            className="w-[10vw] h-[10vw] md:w-[2.5vw] md:h-[2.5vw] flex justify-center items-center bg-GreenGray100 text-Primary rounded-full">
                            <IoMdHeartEmpty className="w-[6vw] h-[6vw] md:w-5 md:h-5"/>
                        </button>
                    </div>

                    {/* Categories & Tags */}
                    <div className="mt-6">
                        <p className="text-[3.7vw] md:text-[1vw] font-Poppins text-Gray500">
                            <span className='font-semibold text-Gray700'>Category:</span>{' '}
                            {
                                product.categories
                                    ? product
                                        .categories
                                        .join(', ')
                                    : 'N/A'
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Product Description */}

            <div className='md:flex md:justify-between mt-[7vw]'>
                <div className='md:w-[50vw]'>
                    <h2
                        className='font-Poppins text-[6vw] md:text-[2.5vw] font-semibold text-Gray800'>Product Description</h2>
                    <div className='flex flex-col justify-center'>
                        <p className='mt-[1vw] font-Poppins text-[3.7vw] md:text-[1vw] text-Gray700'>{product.description}</p>
                        <div className='my-[3vw] md:my-[0.5vw]'>
                            <ul className="list-none px-[1vw] w-full">
                                {
                                    product
                                        .benefits
                                        .map((item, index) => (
                                            <li
                                                key={index}
                                                className="font-Poppins text-[3.7vw] md:text-[1vw] text-Gray700 flex space-x-[0.15vw] py-[1.5vw] md:py-[0.5vw]">
                                                <FaCheckCircle
                                                    className="text-Primary min-w-[5vw] min-h-[5vw] md:min-w-[1.2vw] md:min-h-[1.2vw] mr-2"/>
                                                <span>{item.trim()}</span>
                                            </li>
                                        ))
                                }
                            </ul>
                        </div>
                        <p className='font-Poppins text-[3.7vw] md:text-[1vw] text-Gray700'>{product.additionalDescription}</p>
                    </div>
                </div>

                <div className='hidden md:flex md:w-[50vw]'>
                    <img
                        src={flexImage}
                        alt='A man carrying a basket full of products'
                        className='w-[40vw] h-[30vw] object-cover'/>
                </div>

            </div>

            {/* Related Products */}

            <div className='mt-[7vw]'>
                <h2
                    className='font-Poppins text-[6vw] md:text-[2.5vw] font-semibold text-Gray800 md:text-center'>
                    Related Products
                </h2>
                <Slider {...sliderSettings} ref={sliderRef} className="my-[3vw] md:my-[1.5vw]">
                    {
                        relatedProducts.length > 0
                            ? (relatedProducts.map((relatedProduct) => (
                                <div key={relatedProduct.id} className='px-2 md:px-4'>
                                    <div
                                        className="group relative bg-white rounded-lg transition-all duration-300 border border-Gray100 hover:border-Primary hover:shadow-lg ">
                                        <div className="relative aspect-square ">
                                            <Link
                                                to={`/product/${encodeURIComponent(relatedProduct.name)}`}
                                                onClick={() => window.scrollTo(0,0)}>
                                                <img
                                                    src={relatedProduct.images[0]}
                                                    alt={relatedProduct.name}
                                                    className="w-full h-full object-cover rounded-t-lg"/>
                                            </Link>
                                            <div
                                                className="absolute top-2 right-2 z-10 p-[2vw] md:p-[0.5vw] bg-white rounded-full"
                                                title='Add to wishlist'>
                                                <Heart
                                                    className="w-[5vw] h-[5vw] md:w-[1.2vw] md:h-[1.2vw] text-Gray600 hover:text-Primary cursor-pointer"/>
                                            </div>
                                        </div>
                                        <div className="p-2 md:p-4">
                                            <h3
                                                className="text-Gray800 text-[4vw] md:text-[1vw] font-medium mb-1 md:mb-2 font-Poppins overflow-hidden text-ellipsis whitespace-nowrap">
                                                {relatedProduct.name}
                                            </h3>

                                            <div
                                                className="flex space-x-[2vw] md:space-x-[0.5vw] items-center mt-[1vw] md:mt-0">
                                                <span
                                                    className="text-Gray900 text-[4vw] md:text-[1vw] font-semibold font-Poppins">
                                                    ${
                                                        relatedProduct
                                                            .salePrice
                                                            .toFixed(2)
                                                    }
                                                </span>
                                                <p className="text-[4vw] md:text-[1vw] font-Poppins line-through text-Gray500">
                                                    ${
                                                        relatedProduct
                                                            .regularPrice
                                                            .toFixed(2)
                                                    }
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between mt-[1vw] md:mt-0">
                                                <div className="flex mr-2">
                                                    {
                                                        [...Array(5)].map((_, i) => (
                                                            <span
                                                                key={i}
                                                                className={`text-[5vw] md:text-[1.3vw] ${i < relatedProduct.rating
                                                                    ? 'text-yellow-400'
                                                                    : 'text-Gray300'}`}>
                                                                ★
                                                            </span>
                                                        ))
                                                    }
                                                </div>
                                                <button
                                                    className="group-hover:bg-Primary group-hover:border-Primary group-hover:shadow-md p-2 rounded-full border border-gray-200 transition-all duration-300">
                                                    <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-white"/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            )))
                            : (
                                <p
                                    className='text-center text-[4vw] md:text-[1.5vw] font-Poppins text-gray-500'>
                                    No related products found.
                                </p>
                            )
                    }
                </Slider>
            </div>

            {/* Custom Dots */}
            <div className="slick-dots">
                {
                    relatedProducts.map((_, index) => (
                        <button key={index} className={`dot ${activeSlide === index
                                ? "slick-active"
                                : ""}`} onClick={() => sliderRef.current.slickGoTo(index)}
                            // Navigate to the clicked slide
/>
                    ))
                }
            </div>

        </div>

    );
};

export default ProductDescription;
