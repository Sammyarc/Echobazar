import {useEffect, useState} from 'react';
import {GoLocation, GoChevronDown, GoSearch, GoHeart} from 'react-icons/go';
import {PiPhoneCallLight} from "react-icons/pi";
import {Link} from "react-router-dom";
import Logo from '../../assets/logo/Logo (1).svg';
import Cart from '../../assets/Icons/Bag.svg';
import Avatar from "../../assets/Avatar/download (3).png";
import {useAuthStore} from "../../store/authStore";
import useCartStore from "../../store/useCartStore";
import useWishlistStore from '../../store/useWishlistStore';

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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState('USD');

    const toggleDropdown2 = () => setIsDropdownOpen(!isDropdownOpen);


    const handleCurrencyChange = (currency) => {
        setSelectedCurrency(currency);
        setIsDropdownOpen(false);
    };

    const { cartCount } = useCartStore();

    const { wishlistCount } = useWishlistStore();

    const {user, isAuthenticated} = useAuthStore();

  const [profileImage, setProfileImage] = useState(Avatar); // Default to Avatar initially

  useEffect(() => {
    // Check if `user` and `user.profileImage` exist before setting
    if (user && user.profileImage) {
      setProfileImage(user.profileImage);
    } else {
      setProfileImage(Avatar); // Use default avatar if not logged in or no image
    }
  }, [user]); // Watch `user` for changes

    const date = new Date();
    const hours = date.getHours();

    let timeOfDay

    if (hours < 12) {
        timeOfDay = "morning"
    } else if (hours >= 12 && hours <= 17) {
        timeOfDay = "afternoon"
    } else {
        timeOfDay = "evening"
    }

    return (
        <div>

            {/* Desktop Top Navbar */}
            <div
                className="hidden py-[0.5vw] px-[8vw] md:flex items-center justify-between border-b-2">
                <div className="flex items-center space-x-[0.5vw]">
                    <GoLocation className="text-[1vw] text-Gray600"/>
                    <span className="font-Poppins text-[1vw] text-Gray600">
                        Store Location: 7 Ajegunle Drive, V.I, Lagos State
                    </span>
                </div>

                <div className="flex items-center space-x-[1vw]">
                    <div className="flex items-center gap-[1vw]">
                        {/* Language */}

                        <span className='text-[1.1vw] text-Gray600 font-Poppins'>Eng</span>
                        
                        {/* Currency Dropdown */}
                        <div className="relative">
                            <button
                                aria-label="Select Currency"
                                onClick={toggleDropdown2}
                                aria-haspopup="true"
                                aria-expanded={isDropdownOpen}
                                className="flex items-center text-[1.1vw] text-Gray600 font-Poppins transition duration-200">
                                {selectedCurrency}
                                <GoChevronDown
                                    className={`ml-[0.1vw] text-[1vw] text-Gray600 transition-transform duration-200 ${isDropdownOpen
                                        ? 'rotate-180'
                                        : ''}`}/>
                            </button>
                            {
                                isDropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-1 w-[5vw] bg-white rounded-lg shadow-lg z-10">
                                        <ul className="text-Gray600">
                                            <li
                                                onClick={() => handleCurrencyChange('USD')}
                                                className="px-[1vw] py-[0.3vw] font-Poppins text-[0.9vw] hover:bg-gray-100 cursor-pointer rounded-t-lg">
                                                USD
                                            </li>
                                            <li
                                                onClick={() => handleCurrencyChange('NGN')}
                                                className="px-[1vw] py-[0.3vw] font-Poppins text-[0.9vw] hover:bg-gray-100 cursor-pointer">
                                                NGN
                                            </li>
                                        </ul>
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    {/* Authenticated User Section */}
                    {
                        isAuthenticated
                            ? (
                                <div className="flex items-center space-x-3">
                                    <img
          src={profileImage}
          alt="Profile picture"
          className="w-[9vw] h-[9vw] md:w-[2.5vw] md:h-[2.5vw] border-2 border-GreenGray50 rounded-full object-cover"
        />
                                    <span className="font-Poppins text-[1.1vw] text-Gray600">
                                        Good {timeOfDay}, {user?.name?.split(" ")[0]}
                                    </span>
                                </div>
                            )
                            : (
                                <Link to="/signup" className="text-[1.1vw] text-Gray600 font-Poppins ml-[2vw]">
                                    Sign In / Sign Up
                                </Link>
                            )
                    }
                </div>
            </div>

            {/* Mobile Top Navbar */}
            <div
                className="flex md:hidden items-center justify-between w-full py-[2vw] px-[2vw]">
                <div className="flex items-center gap-[3vw] mt-[1vw]">
                    {/* Language  */}
                    <span className='text-[4.2vw] text-Gray600 font-Poppins'>Eng</span>
                    {/* Currency Dropdown */}
                    <div className="relative">
                        <button
                            aria-label="Select Currency"
                            onClick={toggleDropdown2}
                            aria-haspopup="true"
                            aria-expanded={isDropdownOpen}
                            className="flex items-center text-[4.2vw] text-Gray600 font-Poppins transition duration-200">
                            {selectedCurrency}
                            <GoChevronDown
                                className={`ml-[0.1vw] text-[5.5vw] text-Gray600 transition-transform duration-500 ${isDropdownOpen
                                    ? 'rotate-180'
                                    : ''}`}/>
                        </button>
                        {
                            isDropdownOpen && (
                                <div className="absolute mt-1 w-[20vw] bg-white rounded-lg shadow-lg z-10">
                                    <ul className="text-Gray600">
                                        <li
                                            onClick={() => handleCurrencyChange('USD')}
                                            className="px-[2vw] py-[2vw] font-Poppins text-[4vw] hover:bg-gray-100 cursor-pointer rounded-t-lg">
                                            USD
                                        </li>
                                        <li
                                            onClick={() => handleCurrencyChange('NGN')}
                                            className="px-[2vw] py-[2vw] font-Poppins text-[4vw] hover:bg-gray-100 cursor-pointer">
                                            NGN
                                        </li>
                                    </ul>
                                </div>
                            )
                        }
                    </div>
                </div>

                {/* Authenticated User Section */}
                {
                    isAuthenticated
                        ? (
                            <div className="flex items-center space-x-3 mt-[1vw]">
                                <span className="font-Poppins text-[4.5vw] text-Gray600">
                                    Good {timeOfDay}, {user?.name?.split(" ")[0]}
                                </span>
                            </div>
                        )
                        : (
                            <Link to="/signup" className="text-[4.5vw] text-Gray600 font-Poppins">
                                Sign In / Sign Up
                            </Link>
                        )
                }
            </div>

            {/* Middle navbar */}
            <div
                className='py-[1.5vw] px-[2vw] md:px-[8vw] md:py-[0.1vw] flex items-center justify-between'>

                {/* logo */}

                <img src={Logo} className='w-[40vw] h-[10vw] md:w-[15vw] md:h-[5vw]'/> 
                
                {/* Desktop Search bar */}

                <div
                    className='hidden md:flex w-[30vw] h-[3vw] border border-Gray100 items-center space-x-1 rounded-[0.5vw] focus-within:border-Primary'>

                    {/* Search icon */}

                    <GoSearch className='px-[0.2vw] w-[10%] text-[1.3vw]'/> {/* Search input */}
                    <input
                        type="search"
                        placeholder="Search"
                        className="search-input h-full text-[1vw] outline-none border-none w-[70%] font-Poppins text-Gray900 placeholder:text-Gray400 placeholder:text-[1vw]"/> 
                        
                        {/* Search button */}

                    <button
                        className='bg-Primary w-[20%] h-full border border-Primary rounded-r-[0.5vw] font-Poppins text-White text-[0.9vw]'>
                        Search
                    </button>
                </div>

                {/* Wishlist and cart icon */}
                <div className='flex items-center md:space-x-1'>

                    <Link to="/my-account/wishlist" className="flex items-end space-x-1 relative">
                        <div className="relative">
                            {/* Wishlist Icon */}
                            <GoHeart className="w-[12vw] h-[8vw] md:w-[1.8vw] md:h-[1.8vw]"/> 
                            {/* Wishlist Count Badge */}
                            <span
                                className="absolute -top-[0.15vw] right-[1.5vw] md:right-[0.1vw] bg-Primary text-White text-[3vw] md:text-[0.6vw] rounded-full w-[5vw] md:w-[1vw] h-[5vw] md:h-[1vw] flex items-center justify-center font-Poppins">
                                { wishlistCount }
                            </span>
                        </div>
                        {/* Wishlist Label */}
                        <span className="hidden md:block md:text-[1vw] font-Poppins ml-[2vw]">Wishlist</span>
                    </Link>

                    <Link to="/cart" className="flex items-end space-x-1 relative">
                        <div className="relative">
                            {/* Cart Image */}
                            <img src={Cart} className="ml-[1vw] w-[8.5vw] md:w-[1.8vw] md:h-[1.8vw]"/> 
                            {/* Cart Count Badge */}
                               <span
                                className="absolute top-[0.3vw] md:-top-[0.15vw] right-[0.1vw] bg-Primary text-White text-[3vw] md:text-[0.6vw] rounded-full w-[4.8vw] md:w-[1vw] h-[4.8vw] md:h-[1vw] flex items-center justify-center font-Poppins"
                                >
                                { cartCount }
                                </span>
                        </div>
                        {/* Cart Label */}
                        <span className="hidden md:block md:text-[1vw] font-Poppins ml-[2vw]">Cart</span>
                    </Link>

                </div>
            </div>

            {/* Mobile Search bar */}

            <div
                className='flex md:hidden mx-auto my-[3.5vw] w-[90vw] h-[11vw] border border-Gray200 items-center space-x-1 rounded-[1.5vw] focus-within:border-Primary'>

                {/* Search icon */}

                <GoSearch className='px-[0.2vw] w-[10%] text-[4.5vw]'/> {/* Search input */}
                <input
                    type="search"
                    placeholder="Search"
                    className="search-input h-full text-[3.5vw] outline-none border-none bg-transparent w-[70%] font-Poppins text-Gray900 placeholder:text-Gray400 placeholder:text-[4vw]"/> {/* Search button */}

                <button
                    className='bg-Primary w-[25%] h-full border border-Primary rounded-r-[1.5vw] font-Poppins text-White text-[4vw]'>
                    Search
                </button>
            </div>

            {/* Bottom navbar */}

            <div
                className='bg-Gray800 py-[3vw] px-[2vw] md:py-[1vw] md:px-[8vw] md:flex md:items-center md:justify-between'>
                <nav className="flex justify-around md:justify-normal md:space-x-[2vw]">
                    {
                        Menu.map((item) => (
                            <Link
                                key={item.id}
                                to={item.link}
                                className="text-[4vw] md:text-[1vw] text-White font-Poppins transition duration-200 hover:text-Primary">
                                {item.name}
                            </Link>
                        ))
                    }
                </nav>
                <a
                    href="tel:+(234) 70-5866-7431"
                    className='hidden md:flex items-center space-x-1 mt-[1vw] md:mt-[0vw]'>
                    <PiPhoneCallLight
                        className='text-[5vw] md:text-[1.5vw] text-White font-Poppins'/>
                    <span className="text-[3.6vw] md:text-[1vw] text-White font-Poppins">
                        +(234) 70-5866-7431
                    </span>
                </a>
            </div>
        </div>
    );
};

export default Navbar;
