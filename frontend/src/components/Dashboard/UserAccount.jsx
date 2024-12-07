import {TfiViewListAlt, TfiReload} from "react-icons/tfi";
import {GoHeart} from "react-icons/go";
import {IoSettingsOutline} from "react-icons/io5";
import {Link, Route, Routes, useLocation} from "react-router-dom";
import OrderHistory from "./OrderHistory";
import Wishlist from "./Wishlist";
import UserSettings from "./UserSettings";
import UserAccountInfo from "./UserAccountInfo";
import {TbLogout} from "react-icons/tb";
import {useAuthStore} from "../../store/authStore";
import {useState} from "react";
import { CiMenuBurger } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";

const SIDEBAR_ITEMS = [
    {
        name: 'Dashboard',
        icon: TfiViewListAlt,
        path: "/my-account"
    }, {
        name: 'Order History',
        icon: TfiReload,
        path: "/my-account/orders"
    }, {
        name: 'Wishlist',
        icon: GoHeart,
        path: "/my-account/wishlist"
    }, {
        name: 'Settings',
        icon: IoSettingsOutline,
        path: "/my-account/settings"
    }
];

const UserAccount = () => {
    const {logout} = useAuthStore();
    const location = useLocation();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div className="md:flex md:space-x-[2vw] px-[2vw] md:px-[8vw] my-5 md:my-12">
                    <button
                        className="text-Gray600 text-[6vw] md:hidden py-4 flex space-x-[2vw] items-center"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        {isDropdownOpen ? <IoMdClose size={24} /> : <CiMenuBurger size={24} />}
                    <h1 className="text-Gray700 font-Poppins font-medium text-[4vw]">Menu</h1>
                    </button>
            {/* Navigation */}
            <div className="relative">
                {/* Dropdown Sidebar for Mobile */}
                {
                    isDropdownOpen && (
                        <div className="absolute -top-[1vw] left-0 bg-white shadow-md w-full z-10">
                            <div className="p-4">
                                {
                                    SIDEBAR_ITEMS.map((item, index) => {
                                        const isActive = location.pathname === item.path;
                                        return (
                                            <Link to={item.path} key={index} className={`flex items-center space-x-4 py-4 ${isActive
                                                    ? "text-Primary"
                                                    : "text-Gray600"} hover:text-Primary`} onClick={() => setIsDropdownOpen(false)}
                                                // Close the dropdown when an item is clicked
>
                                                <item.icon className="w-[5vw] h-[5vw]"/>
                                                <span className="font-Poppins font-medium text-[4vw]">{item.name}</span>
                                            </Link>
                                        );
                                    })
                                }
                                <button
                                    className="font-Poppins text-Gray600 flex items-center space-x-4 mt-4 hover:text-Primary"
                                    onClick={() => {
                                        logout();
                                        setIsDropdownOpen(false); // Close the dropdown
                                        window.location.href = "/";
                                    }}>
                                    <TbLogout className="w-[5vw] h-[5vw]" title="logout"/>
                                    <span className="text-[4vw]">Logout</span>
                                </button>
                            </div>
                        </div>
                    )
                }

                {/* Sidebar for Desktop */}
                <div className="hidden md:block border rounded-[0.5vw] w-[15vw] p-[1vw]">
                    {
                        SIDEBAR_ITEMS.map((item, index) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    to={item.path}
                                    key={index}
                                    className={`flex items-center space-x-[2vw] md:space-x-1.5 py-[4vw] md:py-[1vw] ${isActive
                                        ? "text-Primary"
                                        : "text-Gray600"} hover:text-Primary`}
                                    title={item.name}>
                                    <item.icon className="w-[5vw] h-[5vw] md:w-[2vw] md:h-[1.4vw]"/>
                                    <span className="font-Poppins font-medium text-[4vw] md:text-[1vw]">
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })
                    }
                    <div className="py-[4vw] md:py-[1vw]">
                        <button
                            className="font-Poppins text-Gray600 flex items-center space-x-1.5 hover:text-Primary"
                            onClick={() => {
                                logout();
                                window.location.href = "/";
                            }}>
                            <TbLogout className="w-[6vw] h-[6vw] md:w-[2vw] md:h-[1.4vw]" title="logout"/>
                            <span className="text-[4vw] md:text-[1vw]">Logout</span>
                        </button>
                    </div>
                </div>

            </div>

            {/* Main Content */}

            <div className="w-full md:w-[75vw]">
                <Routes>
                    <Route path="/" element={<UserAccountInfo />}/>
                    <Route path="orders" element={<OrderHistory />}/>
                    <Route path="wishlist" element={<Wishlist />}/>
                    <Route path="settings" element={<UserSettings />}/>
                </Routes>
            </div>
        </div>
    )
}

export default UserAccount