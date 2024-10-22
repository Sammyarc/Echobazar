import { useState, useEffect } from 'react';
import {GoLocation, GoChevronDown, GoSearch, GoHeart} from 'react-icons/go';
import {PiPhoneCallLight} from "react-icons/pi";
import {Link} from "react-router-dom";
import Logo from '../../assets/logo/Logo (1).svg';
import Plant from '../../assets/logo/plant 1.svg';
import Cart from '../../assets/Icons/Bag.svg';
import {useAuthStore} from "../../store/authStore";


const Menu = [
    {
        id: 1,
        name: "Home",
        link: "/"
    }, {
        id: 2,
        name: "Shop",
        link: "/shop"
    }, {
        id: 3,
        name: "Blog",
        link: "/blog"
    }, {
        id: 4,
        name: "About us",
        link: "/about"
    }, {
        id: 5,
        name: "Contact us",
        link: "/contact"
    }
];

const Navbar = () => {
    const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
    const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('Eng');
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [logoSrc, setLogoSrc] = useState(Logo);

    const toggleDropdown1 = () => setIsDropdownOpen1(!isDropdownOpen1);
    const toggleDropdown2 = () => setIsDropdownOpen2(!isDropdownOpen2);

    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
        setIsDropdownOpen1(false);
    };

    const handleCurrencyChange = (currency) => {
        setSelectedCurrency(currency);
        setIsDropdownOpen2(false);
    };

    const [cartCount] = useState(0);
    const [wishlistCount] = useState(0);

    const {user, isAuthenticated, logout} = useAuthStore();

    // Function to check window size and change logo accordingly
    const checkWindowSize = () => {
        const windowWidth = window.innerWidth;
        if (windowWidth < 768) {
            setLogoSrc(Plant);  // Change to small logo on mobile
        } else {
            setLogoSrc(Logo);  // Change to large logo on larger screens
        }
    };

    // useEffect to add event listener for window resize
    useEffect(() => {
        // Check window size on component mount
        checkWindowSize();

        // Add event listener for window resize
        window.addEventListener('resize', checkWindowSize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', checkWindowSize);
        };
    }, []);



    return (
        <div>

            {/* Top Navbar */}
            <div className="py-[2vw] px-[2vw] md:py-[0.5vw] md:px-[8vw] md:flex md:items-center md:justify-between border-b-2">
                <div className="flex space-x-[1.5vw] md:items-center md:space-x-[0.5vw]">
                    <GoLocation className="text-[5vw] md:text-[1vw] text-Gray600" />
                    <span className="font-Poppins text-[3.6vw] md:text-[1vw] text-Gray600">
                        Store Location: Lincoln- 344, Illinois, Chicago, USA
                    </span>
                </div>

                <div className="md:flex md:items-center md:space-x-[1vw]">
                    <div className="flex items-center gap-[3vw] mt-[1vw] md:mt-[0vw] md:gap-[1vw]">
                        {/* Language Dropdown */}
                        <div className="relative">
                            <button
                                aria-label="Select Language"
                                onClick={toggleDropdown1}
                                aria-haspopup="true"
                                aria-expanded={isDropdownOpen1}
                                className="flex items-center text-[4vw] md:text-[1vw] text-Gray600 font-Poppins transition duration-200"
                            >
                                {selectedLanguage}
                                <GoChevronDown className={`ml-[0.1vw] text-[4vw] md:text-[1vw] text-Gray600 transition-transform duration-200 ${isDropdownOpen1 ? 'rotate-180' : ''}`} />
                            </button>
                            {isDropdownOpen1 && (
                                <div className="absolute md:right-0 mt-1 w-[20vw] md:w-[5vw] bg-white rounded-lg shadow-lg z-10">
                                    <ul className="text-Gray600">
                                        <li onClick={() => handleLanguageChange('Eng')} className="px-[2vw] py-[2vw] md:px-[1vw] md:py-[0.3vw] font-PublicSans text-[4vw] md:text-[0.9vw] hover:bg-gray-100 cursor-pointer rounded-t-lg">
                                            Eng
                                        </li>
                                        <li onClick={() => handleLanguageChange('Den')} className="px-[2vw] py-[2vw] md:px-[1vw] md:py-[0.3vw] font-PublicSans text-[4vw] md:text-[0.9vw] hover:bg-gray-100 cursor-pointer">
                                            Den
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        {/* Currency Dropdown */}
                        <div className="relative">
                            <button
                                aria-label="Select Currency"
                                onClick={toggleDropdown2}
                                aria-haspopup="true"
                                aria-expanded={isDropdownOpen2}
                                className="flex items-center text-[4vw] md:text-[1vw] text-Gray600 font-Poppins transition duration-200"
                            >
                                {selectedCurrency}
                                <GoChevronDown className={`ml-[0.1vw] text-[4vw] md:text-[1vw] text-Gray600 transition-transform duration-200 ${isDropdownOpen2 ? 'rotate-180' : ''}`} />
                            </button>
                            {isDropdownOpen2 && (
                                <div className="absolute md:right-0 mt-1 w-[20vw] md:w-[5vw] bg-white rounded-lg shadow-lg z-10">
                                    <ul className="text-Gray600">
                                        <li onClick={() => handleCurrencyChange('USD')} className="px-[2vw] py-[2vw] md:px-[1vw] md:py-[0.3vw] font-PublicSans text-[4vw] md:text-[0.9vw] hover:bg-gray-100 cursor-pointer rounded-t-lg">
                                            USD
                                        </li>
                                        <li onClick={() => handleCurrencyChange('NGN')} className="px-[2vw] py-[2vw] md:px-[1vw] md:py-[0.3vw] font-PublicSans text-[4vw] md:text-[0.9vw] hover:bg-gray-100 cursor-pointer">
                                            NGN
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Authenticated User Section */}
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-3 mt-[1vw] md:mt-[0vw]">
                            <span className="font-Poppins text-[4.2vw] md:text-[1.1vw] text-Gray600">
                                Welcome, {user?.name}
                            </span>
                            <button
                                className="font-Poppins text-[4.2vw] md:text-[1.1vw] text-Gray600 hover:underline"
                                onClick={() => {
                                    window.location.reload();
                                    logout();
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/signup" className="text-[4.2vw] md:text-[1.1vw] text-Gray600 font-Poppins md:ml-[2vw]">
                            Sign In / Sign Up
                        </Link>
                    )}
                </div>
            </div>

            {/* Middle navbar */}
            <div
                className='py-[1.5vw] px-[2vw] md:px-[8vw] md:py-[0.1vw] flex items-center justify-between'>

                {/* logo */}
                <img src={logoSrc} className='w-[10vw] h-[10vw] md:w-[15vw] md:h-[5vw]'/> 
                {/* Search bar */}
                <div
                    className='h-[7vw] w-[60vw] md:w-[30vw] md:h-[3vw] border border-Gray300 md:border-Gray100 flex items-center space-x-1 rounded-[1.5vw] md:rounded-[0.5vw]'>

                    {/* Search icon */}
                    <GoSearch className='px-[0.2vw] w-[10%] text-[4vw] md:text-[1.3vw]'/> {/* Search input */}
                    <input
                        type="search"
                        placeholder="Search"
                        className="search-input h-full text-[3.5vw] md:text-[1.3vw] outline-none border-none w-[70%] font-Poppins text-Gray900 placeholder:text-Gray400 placeholder:md:text-[1vw] placeholder:text-[3.2vw]"/> 
                        {/* Search button */}
                    <button
                        className='bg-Primary w-[20%] h-full border border-Primary rounded-r-[1.5vw] md:rounded-r-[0.5vw] font-Poppins text-White text-[2.5vw] md:text-[0.9vw] hover:bg-HardPrimary transition duration-200'>
                        Search
                    </button>
                </div>

                {/* Wishlist and cart icon */}
                <div className='flex items-center space-x-1'>

                    <Link to="/wishlist" className="flex items-end space-x-1 relative">
                        <div className="relative">
                            {/* Wishlist Icon */}
                            <GoHeart className="w-[7vw] h-[6vw] md:w-[1.8vw] md:h-[1.8vw]"/> {/* Wishlist Count Badge */}
                            <span
                                className="absolute -top-[0.15vw] right-[0.1vw] bg-Primary text-White text-[2.5vw] md:text-[0.6vw] rounded-full w-[3vw] md:w-[1vw] h-[3vw] md:h-[1vw] flex items-center justify-center font-Poppins">
                                {wishlistCount}
                            </span>
                        </div>
                        {/* Wishlist Label */}
                        <span className="hidden md:block md:text-[1vw] font-Poppins ml-[2vw]">Wishlist</span>
                    </Link>

                    <Link to="/cart" className="flex items-end space-x-1 relative">
                        <div className="relative">
                            {/* Cart Image */}
                            <img src={Cart} className="ml-[1vw] w-[6.5vw] md:w-[1.8vw] md:h-[1.8vw]"/> 
                            {/* Cart Count Badge */}
                            <span
                                className="absolute -top-[0.15vw] right-[0.1vw] bg-Primary text-White text-[2.5vw] md:text-[0.6vw] rounded-full w-[3vw] md:w-[1vw] h-[3vw] md:h-[1vw] flex items-center justify-center font-Poppins">
                                {cartCount}
                                {/* Replace cartCount with the actual cart count from state */}
                            </span>
                        </div>
                        {/* Cart Label */}
                        <span className="hidden md:block md:text-[1vw] font-Poppins ml-[2vw]">Cart</span>
                    </Link>

                </div>
            </div>

            {/* Bottom navbar */}

            <div
                className='bg-Gray800 py-[2vw] px-[2vw] md:py-[1vw] md:px-[8vw] md:flex md:items-center md:justify-between'>
                <nav className="flex space-x-[4vw] md:space-x-[2vw]">
                    {
                        Menu.map((item) => (
                            <Link
                                key={item.id}
                                to={item.link}
                                className="text-[3.6vw] md:text-[1vw] text-White font-Poppins transition duration-200 hover:text-Gray300">
                                {item.name}
                            </Link>
                        ))
                    }
                </nav>
                <a href="tel:+(219) 555-0114" className='flex items-center space-x-1 mt-[1vw] md:mt-[0vw]'>
                    <PiPhoneCallLight
                        className='text-[5vw] md:text-[1.5vw] text-White font-Poppins'/>
                    <span className="text-[3.6vw] md:text-[1vw] text-White font-Poppins">
                        +(219) 555-0114
                    </span>
                </a>
            </div>
        </div>
    );
};

export default Navbar;
