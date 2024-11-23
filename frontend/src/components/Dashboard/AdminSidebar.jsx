
import { FaBoxOpen, FaUsers, FaClipboardList, FaCog } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { TfiViewListAlt } from "react-icons/tfi";
import { CiMenuFries } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { SiSimpleanalytics } from "react-icons/si";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import Logo from '../../assets/logo/Logo (1).svg';

const SIDEBAR_ITEMS = [
    { name: 'Overview', icon: TfiViewListAlt, path: "/admin-dashboard" },
    { name: 'Orders', icon: FaClipboardList, path: "/admin-dashboard/orders" },
    { name: 'Products', icon: FaBoxOpen, path: "/admin-dashboard/product" },
    { name: 'Customers', icon: FaUsers, path: "/admin-dashboard/customers" },
    { name: 'Analytics', icon: SiSimpleanalytics, path: "/admin-dashboard/analytics" },
    { name: 'Settings', icon: FaCog, path: "/admin-dashboard/settings" }
];

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const { logout } = useAuthStore();

    return (
        <div
            className={`h-screen fixed bg-white shadow-lg p-4 flex flex-col border-r border-gray-100`}
            style={{
                width: isOpen ? '15vw' : '4vw',
                paddingTop: isOpen ? '0.7vw' : '2.5vw'
            }}>
            <div className="flex justify-between items-center">
                {isOpen && <img src={Logo} className='w-[40vw] h-[10vw] md:w-[10vw] md:h-[5vw]' />}
                <button onClick={toggleSidebar} className="text-[1.5vw] rounded-full max-w-fit">
                    {isOpen ? <IoMdClose /> : <CiMenuFries />}
                </button>
            </div>
            <div className="flex-grow" style={{ paddingTop: isOpen ? '10px' : '40px' }}>
                {SIDEBAR_ITEMS.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            to={item.path}
                            key={index}
                            className={`flex items-center space-x-1.5 py-[0.8vw] ${isActive ? 'text-Primary' : 'text-Gray800'} hover:text-Primary active:text-Primary`}
                            title={item.tooltip}>
                            <item.icon className="w-[2vw] h-[1.4vw]" /> {isOpen && <span className="font-Poppins font-medium text-[1vw]">{item.name}</span>}
                        </Link>
                    );
                })}
            </div>
            <div className="mt-auto">
                <button
                    className="font-Poppins text-Gray600 flex items-center space-x-1.5 hover:text-Primary"
                    onClick={() => {
                        logout();
                        window.location.href = "/signup";
                    }}>
                    <TbLogout className="w-[2vw] h-[1.4vw]" title="logout"/> {isOpen && <span className="text-[1vw]">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
