import {TfiViewListAlt, TfiReload} from "react-icons/tfi";
import {GoHeart} from "react-icons/go";
import {IoSettingsOutline} from "react-icons/io5";
import {Link, Route, Routes, useLocation} from "react-router-dom";
import OrderHistory from "./OrderHistory";
import Wishlist from "./Wishlist";
import UserSettings from "./UserSettings";
import UserAccountInfo from "./UserAccountInfo";
import { TbLogout } from "react-icons/tb";
import { useAuthStore } from "../../store/authStore";

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
    const { logout } = useAuthStore();
    const location = useLocation();

    return (
        <div className="flex space-x-[2vw] px-[2vw] md:px-[8vw] my-5 md:my-12">
            {/* Navigation */}
            <div className="border rounded-[0.5vw] w-[15vw] h-full p-[1vw]">
                {
                    SIDEBAR_ITEMS.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                to={item.path}
                                key={index}
                                className={`flex items-center space-x-[2vw] md:space-x-1.5 py-[4vw] md:py-[1vw] ${isActive
                                    ? 'text-Primary'
                                    : 'text-Gray600'} hover:text-Primary`}
                                title={item.name}>
                                <item.icon className="w-[5vw] h-[5vw] md:w-[2vw] md:h-[1.4vw]"/>
                                <span className="font-Poppins font-medium text-[4vw] md:text-[1vw]">{item.name}</span>
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
                        }}
                    >
                        <TbLogout className="w-[6vw] h-[6vw] md:w-[2vw] md:h-[1.4vw]" title="logout" />
                       <span className="text-[4vw] md:text-[1vw]">Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}

            <div className="w-[75vw]">
                    <Routes>
                        <Route path="/" element={<UserAccountInfo />} />
                        <Route path="orders" element={<OrderHistory />} />
                        <Route path="wishlist" element={<Wishlist />} />
                        <Route path="settings" element={<UserSettings />} />
                    </Routes>
                </div>
        </div>
    )
}

export default UserAccount