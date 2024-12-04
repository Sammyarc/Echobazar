import {FaBoxOpen, FaUsers, FaClipboardList, FaCog} from "react-icons/fa";
import {TbLogout} from "react-icons/tb";
import {TfiViewListAlt} from "react-icons/tfi";
import {CiMenuBurger} from "react-icons/ci";
import {IoMdClose} from "react-icons/io";
import {SiSimpleanalytics} from "react-icons/si";
import {Link, useLocation} from "react-router-dom";
import {useAuthStore} from "../../store/authStore";
import Logo from '../../assets/logo/Logo (1).svg';
import { useEffect, useState } from "react";

const SIDEBAR_ITEMS = [
    {
        name: 'Overview',
        icon: TfiViewListAlt,
        path: "/admin-dashboard"
    }, {
        name: 'Orders',
        icon: FaClipboardList,
        path: "/admin-dashboard/orders"
    }, {
        name: 'Products',
        icon: FaBoxOpen,
        path: "/admin-dashboard/product"
    }, {
        name: 'Customers',
        icon: FaUsers,
        path: "/admin-dashboard/customers"
    }, {
        name: 'Analytics',
        icon: SiSimpleanalytics,
        path: "/admin-dashboard/analytics"
    }, {
        name: 'Settings',
        icon: FaCog,
        path: "/admin-dashboard/settings"
    }
];

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const { logout } = useAuthStore();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Update window width on resize
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Determine styles based on screen width
    const isMobile = windowWidth < 768;
    const sidebarWidth = isOpen ? (isMobile ? '50vw' : '15vw') : (isMobile ? '' : '4vw');
    const sidebarLinkTop = isOpen ? (isMobile ? '2vw' : '') : (isMobile ? '2vw' : '1vw');
    const sidebarLinkClick = () => {
        if (isMobile && isOpen) {
            toggleSidebar();
    }
   };

    return (
        <>
            {/* Sidebar */}
            <div
                className='h-screen fixed bg-white shadow-lg p-4 flex flex-col border-r border-gray-100 transition-transform duration-300 z-50'
                style={{
                    width: sidebarWidth,
                    paddingTop: isOpen ? '0.5vw' : '2.5vw'
                }}
            >
                {/* Sidebar content here */}
                <div className="flex justify-between items-center">
                    {isOpen && <img src={Logo} className='w-[30vw] h-[10vw] md:w-[10vw] md:h-[5vw]' />}
                    <button onClick={toggleSidebar} className="text-[6vw] md:text-[1.5vw] rounded-full">
                        {isOpen ? <IoMdClose /> : <CiMenuBurger />}
                    </button>
                </div>
                {/* Sidebar Items */}
                <div style={{
                    marginTop : sidebarLinkTop
                }} >
                    {SIDEBAR_ITEMS.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                to={item.path}
                                key={index}
                                onClick={sidebarLinkClick}
                                className={`flex items-center space-x-[2vw] md:space-x-1.5 py-[4vw] md:py-[1vw] ${isActive ? 'text-Primary' : 'text-Gray600'} hover:text-Primary`}
                                title={item.name}
                            >
                                <item.icon className="w-[5vw] h-[5vw] md:w-[2vw] md:h-[1.4vw]" />
                                {isOpen && <span className="font-Poppins font-medium text-[4vw] md:text-[1vw]">{item.name}</span>}
                            </Link>
                        );
                    })}
                </div>
                {/* Logout Button */}
                <div className="mt-auto">
                    <button
                        className="font-Poppins text-Gray600 flex items-center space-x-1.5 hover:text-Primary"
                        onClick={() => {
                            logout();
                            window.location.href = "/signup";
                        }}
                    >
                        <TbLogout className="w-[6vw] h-[6vw] md:w-[2vw] md:h-[1.4vw]" title="logout" />
                        {isOpen && <span className="text-[4vw] md:text-[1vw]">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Overlay for smaller screens */}
            {isOpen && isMobile && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-Gray700 bg-opacity-50 z-40"
                    onClick={toggleSidebar} // Close sidebar on overlay click
                ></div>
            )}
        </>
    );
};

export default AdminSidebar;
