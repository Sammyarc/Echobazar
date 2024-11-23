// AdminDashboard.js
import { Route, Routes } from "react-router-dom";
import OverviewRoute from "./OverviewRoute";
import ProductsRoute from "./ProductsRoute";
import AdminSidebar from "../components/Dashboard/AdminSidebar";
import AdminHeader from "../components/Dashboard/AdminHeader";
import { useState } from "react";
import CustomerList from "./CustomerList";
import AdminProfileSettings from "./AdminProfileSettings";

const AdminDashboard = () => {
    const year = new Date().getFullYear();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* Main Content */}
            <div
                className={`flex flex-col transition-all duration-200`}
                style={{
                    marginLeft: isSidebarOpen ? '17vw' : '6vw',
                    width: isSidebarOpen ? 'calc(100% - 17vw)' : 'calc(100% - 6vw)'
                }}>
                <AdminHeader />
                <div className="mt-2">
                    <Routes>
                        <Route path="/" element={<OverviewRoute />} />
                        <Route path="product" element={<ProductsRoute />} />
                        <Route path="customers" element={<CustomerList />} />
                        <Route path="settings" element={<AdminProfileSettings />} />
                    </Routes>
                </div>
                <div className="pr-[2vw] pb-[1vw] flex justify-center items-center">
                    <p className="text-[4.2vw] md:text-[1vw] text-Gray500 font-Poppins mt-2 pt-4">
                        Ecobazar © {year} <span className="text-[4.2vw] md:text-[1vw] font-Poppins">All Rights Reserved</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;