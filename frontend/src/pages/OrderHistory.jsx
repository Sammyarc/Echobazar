import React, {useState, useEffect, useCallback} from "react";
import axios from "axios";
import bg from "../../src/assets/Icons/emptystates-empty-cart.svg";
import {IoIosArrowDown} from "react-icons/io";

// Set the API URL based on the environment
const API_URL = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/create"
    : "https://echobazar-fn59.vercel.app/api/create";

axios.defaults.withCredentials = true;

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({page: 1, limit: 10, total: 0});
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("orderDate");
    const [order, setOrder] = useState("desc");
    const [dependencyTracker, setDependencyTracker] = useState(
        {page: 1, limit: 10, search: "", sort: "orderDate", order: "desc"}
    );
    const [isOpen, setIsOpen] = useState(false); // Track dropdown state
    const [isSortOrderOpen, setisSortOrderOpen] = useState(false); // Track dropdown state

    const handleToggle = () => {
        setIsOpen((prevState) => !prevState); // Toggle dropdown open/close
    };

    const handleSortOrderToggle = () => {
      setisSortOrderOpen((prevState) => !prevState); // Toggle dropdown open/close
  };

    // Fetch Orders Function
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/seller/orders`, {
                params: {
                    page: dependencyTracker.page,
                    limit: dependencyTracker.limit,
                    search: dependencyTracker.search,
                    sort: dependencyTracker.sort,
                    order: dependencyTracker.order
                }
            });
            const {data, metadata} = response.data;
            setOrders(data);
            setPagination((prev) => ({
                ...prev,
                total: metadata.total
            }));
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }, [dependencyTracker]);

    // Effect to trigger fetchOrders
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Update Dependency Tracker
    const updateDependencies = (newDeps) => {
        setDependencyTracker((prev) => ({
            ...prev,
            ...newDeps
        }));
    };

    // Handlers
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value); // Update search state
        updateDependencies({search: value}); // Trigger fetch with updated search
    };

    const handlePageChange = (newPage) => updateDependencies({page: newPage});

    const toggleSortOrder = () => {
        const newOrder = order === "desc"
            ? "asc"
            : "desc";
        setOrder(newOrder); // Update order state
        updateDependencies({order: newOrder}); // Trigger fetch with updated order
    };

    const clearSearch = () => {
        setSearch(""); // Reset search state
        updateDependencies({search: ""}); // Trigger fetch with cleared search
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSort(value); // Update sort state
        updateDependencies({sort: value}); // Trigger fetch with updated sort
    };

    return (
        <div
            className="px-4 pt-4 border border-Gray50 rounded-lg mr-[3vw] md:mr-[1vw] h-auto">
            <h2
                className="text-[4.5vw] md:text-[1.5vw] text-Gray700 font-semibold font-Poppins">
                Order List
            </h2>

            {/* Search and Sort Controls */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-[5vw] md:space-y-0 mt-4">
                <div className="flex items-center space-x-2">
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search by product name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="outline-none border border-Gray200 px-[2.5vw] py-[1.5vw] md:px-[1vw] md:py-[0.5vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary w-full md:w-[15vw] text-[3.5vw] md:text-[1vw]"/>
                    <button
                        onClick={() => handleSearchChange({
                            target: {
                                value: search
                            }
                        })}
                        className="bg-Primary rounded-md font-Poppins text-[3.5vw] md:text-[1vw] text-White font-medium w-[35vw] h-[8vw] md:w-[6vw] md:h-[2.5vw] ml-4">
                        Search
                    </button>
                    {
                        search && (
                            <button
                                onClick={clearSearch}
                                className="bg-red-400 rounded-md font-Poppins text-[3.5vw] md:text-[1vw] text-White font-medium w-[35vw] h-[8vw] md:w-[5vw] md:h-[2.5vw] ml-4">
                                Clear
                            </button>
                        )
                    }
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative w-[35vw] md:w-[10vw]">
                        <select
                            value={sort}
                            onChange={handleSortChange}
                            onClick={handleToggle}
                            className="text-[3.2vw] md:text-[0.9vw] w-full h-[9vw] md:h-[2.5vw] bg-transparent font-Poppins outline-none border border-Gray200 rounded-md focus:border-Primary pl-4 pr-8"
                            style={{
                                backgroundImage: 'none', // Remove default arrow in most browsers
                                WebkitAppearance: 'none', // For Safari
                                MozAppearance: 'none', // For Firefox
                                appearance: 'none', // For modern browsers
                                cursor: 'pointer', // Ensure pointer cursor when hovering
                            }}>
                            <option value="orderDate">Order Date</option>
                            <option value="totalAmount">Total Amount</option>
                        </select>

                        {/* Custom arrow icon */}
                        <IoIosArrowDown className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-Gray600 transition-transform duration-300 ${
                            isOpen
                                ? 'rotate-180'
                                : ''}`} size={16}
                        />
                    </div>

                    <div className="relative w-[35vw] md:w-[10vw]">
                    <select
                        value={order}
                        onChange={toggleSortOrder}
                        onClick={handleSortOrderToggle}
                        className='text-[3.2vw] md:text-[0.9vw] w-full h-[9vw] md:h-[2.5vw] bg-transparent font-Poppins outline-none border border-Gray200 rounded-md focus:border-Primary pl-4 pr-8'
                        style={{
                          backgroundImage: 'none', // Remove default arrow in most browsers
                          WebkitAppearance: 'none', // For Safari
                          MozAppearance: 'none', // For Firefox
                          appearance: 'none', // For modern browsers
                          cursor: 'pointer', // Ensure pointer cursor when hovering
                      }}>
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                    {/* Custom arrow icon */}
                    <IoIosArrowDown className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-Gray600 transition-transform duration-300 ${
                            isSortOrderOpen
                                ? 'rotate-180'
                                : ''}`} size={16}
                        />
                    </div>
                    
                </div>
            </div>

            {/* Loading State */}
            <div className="overflow-scroll custom-scrollbar">
                {
                    loading
                        ? (
                            <div className="flex flex-col p-[5vw] justify-center items-center h-[100vw] md:h-full">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-Primary"></div>
                                <h3
                                    className="text-[4vw] md:text-[1.5vw] text-Gray500 font-semibold font-Poppins mt-[2vw]">
                                    Loading orders, please wait...
                                </h3>
                            </div>

                        )
                        : orders.length > 0
                            ? (
                                <table
                                    className="w-[350%] md:w-full mt-6 mb-2">
                                    <thead className="bg-Gray100">
                                        <tr>
                                            <th className="p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Order ID</th>
                                            <th className="p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Product Name</th>
                                            <th className="p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Quantity</th>
                                            <th className="p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Price</th>
                                            <th className="p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Total Amount</th>
                                            <th className="p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Order Date</th>
                                            <th className="p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Payment Status</th>
                                            <th className="p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            orders.map((order) => (
                                                <React.Fragment key={order._id}>
                                                    <tr className="border-b border-Gray200">
                                                        <td
                                                            className="p-[3vw] md:p-[1vw] font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700"
                                                            rowSpan={order.orderItems.length}>
                                                            {order.orderId}
                                                        </td>
                                                        <td className="p-[3vw] md:p-[1vw] font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">
                                                          {
                                                                order
                                                                    .orderItems[0]
                                                                    .name
                                                            }</td>
                                                        <td className="p-[3vw] md:p-[1vw] font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">{
                                                                order
                                                                    .orderItems[0]
                                                                    .quantity
                                                            }</td>
                                                        <td className="p-[3vw] md:p-[1vw] font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">${
                                                                order
                                                                    .orderItems[0]
                                                                    .salePrice
                                                            }</td>
                                                        <td className="p-[3vw] md:p-[1vw] font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">${
                                                                order
                                                                    .orderItems[0]
                                                                    .totalAmount
                                                            }</td>
                                                        <td className="p-[3vw] md:p-[1vw] font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700" rowSpan={order.orderItems.length}>
                                                            {new Date(order.orderDate).toLocaleDateString()}
                                                        </td>
                                                        <td className="p-[3vw] md:p-[1vw] font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700" rowSpan={order.orderItems.length}>
                                                            <span
                                                                className={`py-1.5 px-3 font-Poppins text-[3.2vw] md:text-[0.9vw] rounded text-white ${
                                                                order.paymentStatus === "successful"
                                                                    ? "bg-green-500"
                                                                    : "bg-red-500"}`}>
                                                                {order.paymentStatus}
                                                            </span>
                                                        </td>
                                                        <td
                                                            className="p-3 font-Poppins text-[3.5vw] md:text-[1vw] font-medium text-Gray700"
                                                            rowSpan={order.orderItems.length}>
                                                            <button className="text-Primary">
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    {
                                                        order
                                                            .orderItems
                                                            .slice(1)
                                                            .map((item, index) => (
                                                                <tr key={`${order._id}-${index}`} className="border-b border-Gray200">
                                                                    <td className="p-[3vw] md:p-[1vw] font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">{item.name}</td>
                                                                    <td className="p-[3vw] md:p-[1vw] font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">{item.quantity}</td>
                                                                    <td className="p-[3vw] md:p-[1vw] font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">${item.salePrice}</td>
                                                                    <td className="p-[3vw] md:p-[1vw] font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">${item.totalAmount}</td>
                                                                </tr>
                                                            ))
                                                    }
                                                </React.Fragment>
                                            ))
                                        }
                                    </tbody>

                                </table>
                            )
                            : (
                                // No Orders State
                                <div className="flex flex-col justify-center items-center h-[100vw] md:h-full">
                                    <img src={bg} alt="Empty Cart" className="mx-auto md:w-[20vw] md:h-[25vw]"/>
                                    <p
                                        className="text-[4vw] md:text-[1.5vw] text-Gray500 font-semibold font-Poppins mt-[2vw]">
                                        No orders available.
                                    </p>
                                </div>
                            )
                }
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
                {
                    Array.from({
                        length: Math.ceil(pagination.total / pagination.limit)
                    }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            disabled={pagination.page === i + 1}
                            className={`mx-2 px-3 py-2 rounded-lg ${
                            pagination.page === i + 1
                                ? "bg-gray-400 text-white"
                                : "bg-gray-200"}`}>
                            {i + 1}
                        </button>
                    ))
                }
            </div>
        </div>
    );
};

export default OrderHistory;

